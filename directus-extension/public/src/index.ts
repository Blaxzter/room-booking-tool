import { defineEndpoint } from '@directus/extensions-sdk'
import { subDays } from 'date-fns'

export default defineEndpoint((router, { database }) => {
  // Define a GET route that takes 'id' as a parameter
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const secretKeysParam = req.query.secret_keys
      let secretKeys: string[] = []
      if (typeof secretKeysParam === 'string') {
        secretKeys = secretKeysParam.split(',')
      }

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

      const bookingFields = [
        'public.booking.id',
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
      let bookings = await database('public.booking')
        .leftJoin('directus_users', 'public.booking.confirmed_by', 'directus_users.id')
        .where({ bookable_object_id: bookableObject.id })
        .andWhere('start_date', '>=', dateCutOff)
        .select(bookingFields)

      // If secret keys are provided, fetch those bookings with all details
      let privateBookings: any[] = []
      if (secretKeys.length > 0) {
        privateBookings = await database('public.booking')
        .leftJoin('directus_users', 'public.booking.confirmed_by', 'directus_users.id')
        .where({ bookable_object_id: bookableObject.id })
          .whereIn('public.booking.secret_edit_key', secretKeys)
          .select([
            'public.booking.id',
            'public.booking.start_date',
            'public.booking.end_date',
            'public.booking.confirmed',
            'public.booking.display_name as booking_display_name',
            'public.booking.description',
            'public.booking.mail',
            'public.booking.phone',
            'public.booking.is_full_day',
            'public.booking.status',
            'public.booking.secret_edit_key'
          ])

        // remove all bookings from the bookingsarray with the same id   
        bookings = bookings.filter((booking) => !privateBookings.some((privateBooking) => privateBooking.id === booking.id))
      }

      // remove id from bookable_object
      delete bookableObject.id

      // Return the combined data
      return res.send({
        bookableObject,
        bookings: [...bookings, ...privateBookings]
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      return res.status(500).send({ error: 'An error occurred while fetching data' })
    }
  })

  // Define a POST route to create a booking request
  router.post('/:id/booking', async (req, res) => {
    try {
      const { id } = req.params
      const { 
        start_date, 
        end_date, 
        is_full_day,
        mail,
        phone,
        description, 
        confirmed = false,
        status,
        secret_edit_key
      } = req.body

      // Validate required fields
      if (!start_date || !end_date || !mail) {
        return res.status(400).send({ error: 'Missing required fields: start_date, end_date, mail' })
      }

      // Find the bookable object by uniqueId
      const bookableObject = await database('public.bookable_object')
        .select('id')
        .where({ uniqueId: id })
        .first()

      if (!bookableObject) {
        return res.status(404).send({ error: 'Bookable object not found' })
      }

      // Create the booking request
      const [newBookingId] = await database('public.booking').insert({
        bookable_object_id: bookableObject.id,
        start_date,
        end_date,
        is_full_day,
        mail,
        phone,
        description,
        confirmed,
        status,
        secret_edit_key,
      }).returning('id')

      return res.status(201).send({ 
        message: 'Booking request created successfully',
        id: newBookingId.id
      })
    } catch (error) {
      console.error('Error creating booking request:', error)
      return res.status(500).send({ error: 'An error occurred while creating the booking request' })
    }
  })

  // Define a DELETE route to delete a booking by secret_edit_key
  router.delete('/:id/booking', async (req, res) => {
    try {
      const { id } = req.params
      // Accept secret_edit_key from body or query
      const secret_edit_key = req.body.secret_edit_key || req.query.secret_edit_key
      if (!secret_edit_key) {
        return res.status(400).send({ error: 'Missing secret_edit_key' })
      }
      // Find the bookable object by uniqueId
      const bookableObject = await database('public.bookable_object')
        .select('id')
        .where({ uniqueId: id })
        .first()
      if (!bookableObject) {
        return res.status(404).send({ error: 'Bookable object not found' })
      }
      // Delete the booking with the matching bookable_object_id and secret_edit_key
      const deletedRows = await database('public.booking')
        .where({ bookable_object_id: bookableObject.id, secret_edit_key })
        .del()
      if (deletedRows === 0) {
        return res.status(404).send({ error: 'Booking not found or already deleted' })
      }
      return res.status(200).send({ message: 'Booking deleted successfully' })
    } catch (error) {
      console.error('Error deleting booking:', error)
      return res.status(500).send({ error: 'An error occurred while deleting the booking' })
    }
  })
})
