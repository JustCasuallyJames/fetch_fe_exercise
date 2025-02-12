## Fetch FE Exercise
Fetch Take Home Assessment for Frontend Engineer position.

## Website

Feel free to access the [website](https://fetch-fe-exercise-git-main-justcasuallyjames-projects.vercel.app/) that's hosted via Vercel.

## Running locally
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used
- Next.js
- React
- Javascript
- Vercel

## Requirements

- [x] Users must be able to filter by breed
- [x] Results should be paginated
- [x] Results should be sorted alphabetically by breed by default. Users should be able to modify this sort to be ascending or descending.
- [x] Generate dog matches based on user-selected favorites
- [x] All fields of the Dog object (except for id) must be presented in some form

What I did on top of the requirements:
- [x] Added additional fields to the Dog cards which includes the location of where they're at (zip Code, city, county, state)
- [x] Have a nice greeting at the top of their name

## Future Improvements
- [ ] Filter by zipcode, ages, and multiple breeds
- [ ] Sort by name and age in ascending/descending order
- [ ] Include statistics about how many dogs are in need for adoption in a certain geoBoundingBox. This utilizes the POST /locations/search endpoint
- [ ] Using a proper database like postgreSQL
- [ ] Jumping to specific pages via user input within the Pagination
- [ ] Better UX 


