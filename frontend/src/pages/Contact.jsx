import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      console.log("Sending Data:", form);

      const response = await axios.post(
        "http://localhost:5000/api/auth/contact",
        form
      );

      console.log("Server Response:", response.data.message);
      alert(response.data.message);

      // RESET FORM
      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {
      console.error("Error sending message:", error.response?.data);
      alert(
        error.response?.data?.message ||
        "Failed to send message. Try again later."
      );
    }
  };

  document.title = "Contact";

  return (
    <div className="page contact-page">
      <div className="container my-5">
        <h1 className="fw-bold text-center mb-4 text-light">Contact Us</h1>

        <p className="text-center mb-4 text-light" style={{ fontSize: "18px" }}>
          Have any questions or need help with the Pothole on road?
        </p>

        <div className="row g-4 align-items-stretch">
          {/* CONTACT FORM */}
          <div className="col-md-6 d-flex flex-column">
            <form
              className="shadow p-4 rounded contact-form-card flex-grow-1 d-flex flex-column"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label text-light">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-auto">
                Send Message
              </button>
            </form>
          </div>

          {/* GOOGLE MAP */}
          <div className="col-md-6 d-flex">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=india&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="rounded shadow flex-grow-1"
              style={{ border: 0, width: "100%", height: "100%", minHeight: "350px" }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
