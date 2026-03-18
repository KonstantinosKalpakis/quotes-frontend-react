db = db.getSiblingDB("admin");

// Create the user.
db.createUser({
  user: "quotes-backend",
  pwd: "quotes-backend",
  roles: [
    {
      role: "readWrite",
      db: "quotes-db",
    },
  ],
});

// Create the database.
qb = db.getSiblingDB("quotes-db");

// Create the collection.
qb.createCollection("quotes");
