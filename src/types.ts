

export type MySchema = {
  bookable_object: BookableObject[];
}

export type BookableObject = {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  tags: string[];
}
