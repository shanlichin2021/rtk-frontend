import React, { useState, useContext } from "react";
import { PuffLoader, RingLoader, HashLoader } from "react-spinners";
import { ModelEndpointContext } from "../components/ModelEndpointContext";
import api from "../api"; // ⬅️  use token‑aware wrapper (no plain axios)

const FormPage = () => {
  const { endpoints } = useContext(ModelEndpointContext);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    city: "",
    state: "",
    country: "",
    profession: "",
    ssn: "",
    parents: "",
    address: "",
    receiveEmail: false,
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [emailNotice, setEmailNotice] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ────────────────────────────────
  // Prompt builders
  // ────────────────────────────────
  const buildPrompt = () => `User Information:
Name: ${formData.name}
Date of Birth: ${formData.dob}
Email: ${formData.email || "N/A"}
Location: ${formData.city}, ${formData.state}, ${formData.country}
Profession: ${formData.profession}

Optional Sensitive Information:
SSN: ${formData.ssn || "N/A"}
Parents: ${formData.parents || "N/A"}
Address: ${formData.address || "N/A"}

Please analyze the above information and review whether your training data might include any personal or sensitive information related to this user. Identify potential issues and provide a concise summary in bullet points.`;

  /**
   * Summarise N model replies using a single model.
   */
  const summariseResponses = async (results) => {
    const combined = results
      .map((r, i) => `Response ${i + 1} – ${r.modelName}:\n${r.reply}`)
      .join("\n\n");

    const summaryPrompt = `Below are responses from multiple AI models regarding a user's personal information. Summarise key findings in bullet points (each starting with \"-\").\n\n${combined}`;

    // use the first endpoint as default summariser
    const ep = endpoints[0];

    const response = await api.post("/api/chat", {
      history: [],
      message: summaryPrompt,
      modelName: ep.model,
    });
    return response.data.reply;
  };

  // ────────────────────────────────
  // Form submit handler
  // ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");
    setEmailNotice("");

    const promptMessage = buildPrompt();

    try {
      // Fire requests to each endpoint in parallel – all via token‑aware api
      const requests = endpoints.map((ep) =>
        api.post("/api/chat", {
          history: [],
          message: promptMessage,
          modelName: ep.model,
        })
      );

      const responses = await Promise.all(requests);
      const results = responses.map((res, i) => ({
        modelName: endpoints[i].name,
        reply: res.data.reply,
      }));

      // Summarise
      const summarised = await summariseResponses(results);
      setSummary(summarised);

      if (formData.receiveEmail && formData.email) {
        setEmailNotice(`The summary will be emailed to ${formData.email}.`);
      }
    } catch (err) {
      console.error(err);
      setSummary("Error retrieving responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      {/* Two-column layout with a vertical divider */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT COLUMN */}
        <div className="md:w-1/2 pr-8 border-r border-[#17264b]">
          <div className="p-8 rounded-[5px] shadow-md">
            <div className="bg-[#070c19] mt-8 border border-[#17264b] p-6 rounded-[6px] mb-6">
              <p className="mb-4">
                The goal of this project is to be a stepping stone towards
                ensuring AI transparency.
              </p>
              <p className="mb-4">
                Our tool audits AI training datasets to check for inadvertent
                inclusion of personal information, helping you verify and
                maintain your digital privacy.
              </p>
              <p className="mb-4">
                We securely submit your data to multiple AI models for analysis.
              </p>
              <p className="mb-4">
                <strong>
                  All information you submit is used exclusively for the form
                  submission process.{" "}
                  <span className="text-[#d30000]">
                    Your information is NOT stored within the app or any
                    external servers.
                  </span>
                </strong>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                />
              </div>
              <div>
                <label className="block mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                />
              </div>
              <div>
                <label className="block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                  />
                </div>
                <div>
                  <label className="block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                />
              </div>
              <fieldset className="border border-[#17264b] p-4 rounded">
                <legend className="px-2">
                  Sensitive Information (Optional)
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block mb-1">SSN</label>
                    <input
                      type="text"
                      name="ssn"
                      value={formData.ssn}
                      onChange={handleChange}
                      className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Parent(s)</label>
                    <input
                      type="text"
                      name="parents"
                      value={formData.parents}
                      onChange={handleChange}
                      className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 border border-[#0f1937] rounded bg-[#070c19]"
                    />
                  </div>
                </div>
              </fieldset>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="receiveEmail"
                  checked={formData.receiveEmail}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Receive results via email</span>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#d30000] text-white px-4 py-2 rounded hover:bg-[#832925] transition flex items-center"
                >
                  {loading ? <HashLoader size={20} color="#fff" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:w-1/2 pl-8 mt-10">
          <div className="p-8 rounded-[5px] shadow-md flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <RingLoader size={60} color="#0087f0" />
                <p className="mt-4">Analyzing...</p>
              </div>
            ) : summary ? (
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center ">
                  Results:
                </h3>
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap">{summary}</pre>
                  {emailNotice && (
                    <p className="mt-2 text-green-300">{emailNotice}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <p className="mb-4">Awaiting submission...</p>
                <div>
                  <PuffLoader size={60} color="#0087f0" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
