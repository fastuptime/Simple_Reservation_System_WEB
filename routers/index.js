const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("pages/index", {
    data: db.get("rezervasyon") || [],
    tables: db.get("rooms") || [],
    customers: db.get("customers") || [],
  });
});

router.get("/table_and_room_list", async (req, res) => {
  res.render("pages/table_and_room_list", {
    data: db.get("rooms") || [],
  });
});

router.get("/customer_list", async (req, res) => {
  res.render("pages/customer_list", {
    data: db.get("customers") || [],
  });
});

router.get("/customer_create", async (req, res) => {
  res.render("pages/customer_create");
});

router.post("/customer_create", async (req, res) => {
  const { name, surname, phone, note } = req.body;
  if (!name || !surname || !phone)
    return res.redirect(
      "/customer_create?status=false&message=Boş Alan Bırakmayınız",
    );
  db.push("customers", {
    id: Math.floor(Math.random() * 9999999),
    name,
    surname,
    phone,
    note,
    created_at: new Date().toLocaleString(),
    updated_at: new Date().toLocaleString(),
  });
  res.redirect("/customer_list?status=true&message=Müşteri Eklendi");
});

router.get("/table_and_room_create", async (req, res) => {
  res.render("pages/table_and_room_create");
});

router.post("/room_create", async (req, res) => {
  const { name, capacity } = req.body;
  if (!name || !capacity)
    return res.redirect(
      "/table_and_room_create?status=false&message=Boş Alan Bırakmayınız",
    );
  db.push("rooms", {
    id: Math.floor(Math.random() * 9999999),
    name,
    capacity: Number(capacity),
    reservation_count: 0,
    created_at: new Date().toLocaleString(),
    updated_at: new Date().toLocaleString(),
  });
  res.redirect("/table_and_room_list?status=true&message=Oda Eklendi");
});

router.post("/reservation_create", async (req, res) => {
  const { table, customer, person_count, start_date, end_date } = req.body;
  if (!table || !customer || !person_count || !start_date || !end_date)
    return res.json({ status: "error", message: "Boş Alan Bırakmayınız" });

  db.push("rezervasyon", {
    id: Math.floor(Math.random() * 9999999),
    table: {
      name: db.get("rooms").find((x) => x.id == table).name,
      id: table,
    },
    customer: {
      name: db.get("customers").find((x) => x.id == customer).name,
      id: customer,
    },
    person_count: Number(person_count),
    start_date,
    end_date,
    created_at: new Date().toLocaleString(),
    updated_at: new Date().toLocaleString(),
  });
  let room = db.get("rooms").find((x) => x.id == table);
  room.reservation_count = room.reservation_count + 1;
  db.set(
    "rooms",
    db.get("rooms").map((x) => (x.id == table ? room : x)),
  );
  res.json({ status: "success", message: "Rezervasyon Eklendi" });
});

router.get("/reservation_cancel/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.redirect("/?status=false&message=Boş Alan Bırakmayınız");
  let reservation = db.get("rezervasyon").find((x) => x.id == id);
  if (!reservation)
    return res.redirect("/?status=false&message=Rezervasyon Bulunamadı");
  let room = db.get("rooms").find((x) => x.id == reservation.table.id);
  room.reservation_count = room.reservation_count - 1;
  db.set(
    "rooms",
    db.get("rooms").map((x) => (x.id == reservation.table.id ? room : x)),
  );
  db.set(
    "rezervasyon",
    db.get("rezervasyon").filter((x) => x.id != id),
  );
  res.redirect("/?status=true&message=Rezervasyon İptal Edildi");
});

router.get("/customer_cancel/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.redirect(
      "/customer_list?status=false&message=Boş Alan Bırakmayınız",
    );
  db.set(
    "customers",
    db.get("customers").filter((x) => x.id != id),
  );
  res.redirect("/customer_list?status=true&message=Müşteri Silindi");
});

router.get("/room_cancel/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.redirect(
      "/table_and_room_list?status=false&message=Boş Alan Bırakmayınız",
    );
  db.set(
    "rooms",
    db.get("rooms").filter((x) => x.id != id),
  );
  res.redirect("/table_and_room_list?status=true&message=Oda Silindi");
});

module.exports = router;
