Seeding PostgreSQL db manually we need to make PostgreSQL start adding new records starting with another value.
Start generating IDs starting with 100 using SQL commands:

```
SELECT setval('users_id_seq', 100);
SELECT setval('coffee_id_seq', 100);
SELECT setval('coffee_profile_id_seq', 100);
SELECT setval('review_id_seq', 100);
SELECT setval('review_metadata_id_seq', 100);
```
