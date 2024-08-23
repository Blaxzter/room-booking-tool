import { defineEndpoint } from '@directus/extensions-sdk'
import { subDays } from 'date-fns'

export default defineEndpoint((router, { database }) => {
  // Define a GET route that takes 'id' as a parameter
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params

      // Query the bookable_object table using the uniqueId
      const bookableObject = await database('public.bookable_object')
        .select(
          'id',
          'name',
          'description',
          'uniqueId',
          'type',
          'tags',
          'image',
          'information_shared',
          'confirm_booking_required'
        )
        .where({ uniqueId: id })
        .first()

      if (!bookableObject) {
        return res.status(404).send({ error: 'Bookable object not found' })
      }

      // replace image with { id: string }
      if (bookableObject.image) {
        bookableObject.image = { id: bookableObject.image }
      }

      // 15 days ago
      const dateCutOff = subDays(new Date(), 15)

      // if bookableObject.information_shared ->

      const bookingFields = [
        'public.booking.start_date',
        'public.booking.end_date',
        'public.booking.confirmed',
        'directus_users.display_name as confirmed_by_name'
      ]
      if (bookableObject.information_shared) {
        bookingFields.push('directus_users.email')
        bookingFields.push('public.booking.display_name as booking_display_name')
        bookingFields.push('public.booking.description')
      }

      // Query the booking table to get all bookings related to the bookable object
      const bookings = await database('public.booking')
        .leftJoin('directus_users', 'public.booking.confirmed_by', 'directus_users.id')
        .where({ bookable_object_id: bookableObject.id })
        .andWhere('start_date', '>=', dateCutOff)
        .select(bookingFields)

      // remove id from bookable_object
      delete bookableObject.id

      // Return the combined data
      return res.send({
        bookableObject,
        bookings
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      return res.status(500).send({ error: 'An error occurred while fetching data' })
    }
  })
})
