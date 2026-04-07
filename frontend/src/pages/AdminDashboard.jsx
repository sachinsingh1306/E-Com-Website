import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Products",
      text: "Create, edit, and delete products.",
      link: "/admin/products",
    },
    {
      title: "Orders",
      text: "Track all orders and approve delivery.",
      link: "/admin/orders",
    },
    {
      title: "Users",
      text: "View, edit, promote, and delete users.",
      link: "/admin/users",
    },
  ];

  return (
    <section className="page-section">
      <div className="hero">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Manage the full store from one place.</h1>
          <p className="muted">
            Products, orders, delivery approval, and user administration.
          </p>
        </div>
      </div>

      <div className="product-grid">
        {cards.map((card) => (
          <article key={card.title} className="card card--stack">
            <h2>{card.title}</h2>
            <p className="muted">{card.text}</p>
            <Link className="button" to={card.link}>
              Open {card.title}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
