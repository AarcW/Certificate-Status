import React, { useState } from "react";
import "./FormStyles.css";

function GradesheetApplicationForm() {
  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    email: "",
    mobile: "",
    numCopies: "",
    mailingAddress: "",
    universityAddress: "",
    amountPaid: "",
    sbiDuNumber: "",
    transactionDate: "",
    date: "",
    semesters: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSemesterChange = (year, term) => {
    setFormData((prev) => ({
      ...prev,
      semesters: {
        ...prev.semesters,
        [year]: {
          ...prev.semesters[year],
          [term]: !prev.semesters[year]?.[term],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted! Check the console for submitted data.");
  };

  const academicYears = [
    "2014-15",
    "2015-16",
    "2016-17",
    "2017-18",
    "2018-19",
    "2019-20",
    "2020-21",
    "2021-22",
    "2022-23",
    "2023-24",
  ];

  const terms = ["SEM I", "SEM II", "Summer Term"];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1 className="form-title">Gradesheet Application Form</h1>

      <p>
        To<br />
        The Associate Dean,<br />
        AUGS Division BITS, Pilani – K.K Birla Goa Campus
      </p>
      <p>
        Sir,<br />
        Please issue me duplicate grade sheets. The following are my details:
      </p>

      <label>ID Number *</label>
      <input type="text" name="idNumber" required className="form-input" onChange={handleChange} />

      <label>Name *</label>
      <input type="text" name="name" required className="form-input" onChange={handleChange} />

      <label>Email Address *</label>
      <input type="email" name="email" required className="form-input" onChange={handleChange} />

      <label>Mobile Number *</label>
      <input type="text" name="mobile" required className="form-input" onChange={handleChange} />

      <label>Duplicate gradesheet for following semester</label>
      <table className="checkbox-table">
        <thead>
          <tr>
            <th>Academic Year</th>
            {terms.map((term) => (
              <th key={term}>{term}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {academicYears.map((year) => (
            <tr key={year}>
              <td>{`Academic Year ${year}`}</td>
              {terms.map((term) => (
                <td key={term}>
                  <input
                    type="checkbox"
                    checked={formData.semesters[year]?.[term] || false}
                    onChange={() => handleSemesterChange(year, term)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <label>Number of Copies *</label>
      <input type="number" name="numCopies" required className="form-input" onChange={handleChange} />

      <label>Mailing Address (Postal/Email)</label>
      <textarea name="mailingAddress" className="form-input" onChange={handleChange} />

      <label>University address (if gradesheet has to be sealed)</label>
      <textarea name="universityAddress" className="form-input" onChange={handleChange} />

      <p>
        Charges: <br />
        Duplicate gradesheet - Rs 100/- per copy<br />
        Envelope Charges: <br />A4 size - Rs 20/-, Legal size - Rs 40/-<br />
        Postal / Courier Charges: <br />Within India - Rs 250/- <br />Canada - Rs 4200/- <br />Other Countries - Rs 3600/-
      </p>

      <p>
        <strong>Payment should be done through SBI Collect</strong>
      </p>

      <p>
        <em>Example Calculation:</em><br />
        E.g., if a student requires 5 duplicate copies:<br />
        4 copies sealed, sent to home address (India)<br />
        1 copy sent to a foreign university<br />
        Charges:<br />
        Duplicate Grade-sheet: (5 * Rs 100) = Rs 500<br />
        2 A4 size envelopes: (2 * Rs 20) = Rs 40<br />
        1 Legal size envelope for 4 sealed copies: Rs 40<br />
        Postal Charges within India: Rs 250<br />
        Postal Charge for Foreign University: Rs 3600<br />
        Total charges to pay: Rs 4430<br />
      </p>

      <label>Total Amount Paid *</label>
      <input type="text" name="amountPaid" required className="form-input" onChange={handleChange} />

      <label>SBI DU Number Details *</label>
      <input type="text" name="sbiDuNumber" required className="form-input" onChange={handleChange} />

      <label>Date of Transaction *</label>
      <input type="date" name="transactionDate" required className="form-input" onChange={handleChange} />

      <label>Date *</label>
      <input type="date" name="date" required className="form-input" onChange={handleChange} />

      

      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}

export default GradesheetApplicationForm;
