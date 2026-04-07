import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Products",
      text: "Create, edit, and manage your full product catalog with images, stock, and pricing.",
      link: "/admin/products",
      color: "from-sky-500 to-blue-600",
      icon: "📦",
    },
    {
      title: "Orders",
      text: "Track customer orders, approve delivery, and manage tracking numbers easily.",
      link: "/admin/orders",
      color: "from-emerald-500 to-teal-600",
      icon: "🚚",
    },
    {
      title: "Users",
      text: "View users, update profiles, and promote users to admin with secret key access.",
      link: "/admin/users",
      color: "from-violet-500 to-purple-600",
      icon: "👥",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 px-8 py-10 text-white shadow-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
            Admin Dashboard
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Manage the full store from one place
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100 sm:text-base">
            Control products, orders, delivery approvals, and user roles with a
            clean and powerful admin experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-2xl text-white shadow-lg`}
              >
                {card.icon}
              </div>

              <h2 className="text-2xl font-bold text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>

              <Link
                className={`mt-6 inline-flex rounded-2xl bg-gradient-to-r ${card.color} px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
                to={card.link}
              >
                Open {card.title}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
