import React, { useState } from "react";
import "./FormStyles.css";

function GradesheetApplicationForm() {
  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    email: "",
    mobile: "",
    homeAddress: "",
    homeAddressCountry: "",
    numCopies: 0,
    universities: [],
    selectedYears: [],
    amountPaid: "",
    sbiDuNumber: "",
    transactionDate: "",
    collectFromBITSGoa: false,
  });

  const [calculatedCharges, setCalculatedCharges] = useState({
    gradesheetCharges: 0,
    envelopeCharges: 0,
    postalCharges: 0,
    totalCharges: 0,
  });

  const countries = ["India", "USA", "Canada", "Others"];
  const years = Array.from({ length: 21 }, (_, i) => `${2004 + i}-${2005 + i}`);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "collectFromBITSGoa" && checked) {
      calculateCharges({ ...formData, collectFromBITSGoa: true });
    } else {
      calculateCharges({ ...formData, [name]: newValue });
    }
  };

  const handleAddUniversity = () => {
    if (formData.universities.length >= formData.numCopies) {
      alert("The number of universities cannot exceed the number of copies.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      universities: [
        ...prev.universities,
        { address: "", country: "", deliverToHome: false },
      ],
    }));
  };

  const handleRemoveUniversity = (index) => {
    const updatedUniversities = formData.universities.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, universities: updatedUniversities }));
    calculateCharges({ ...formData, universities: updatedUniversities });
  };

  const handleUniversityChange = (index, field, value) => {
    const updatedUniversities = [...formData.universities];
    updatedUniversities[index][field] = field === "deliverToHome" ? value : value;
    setFormData((prev) => ({
      ...prev,
      universities: updatedUniversities,
    }));
    calculateCharges({ ...formData, universities: updatedUniversities });
  };

  const handleYearSelection = (year) => {
    if (!formData.selectedYears.find((y) => y.year === year)) {
      setFormData((prev) => ({
        ...prev,
        selectedYears: [
          ...prev.selectedYears,
          { year, sem1: false, sem2: false, summerTerm: false },
        ],
      }));
    }
  };

  const handleYearCheckboxChange = (index, semester) => {
    const updatedYears = [...formData.selectedYears];
    updatedYears[index][semester] = !updatedYears[index][semester];
    setFormData((prev) => ({ ...prev, selectedYears: updatedYears }));
    calculateCharges({ ...formData, selectedYears: updatedYears });
  };

  const handleYearRemoval = (index) => {
    const updatedYears = formData.selectedYears.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, selectedYears: updatedYears }));
    calculateCharges({ ...formData, selectedYears: updatedYears });
  };

  const calculateCharges = (data) => {
    const numCopies = parseInt(data.numCopies || 0);

    // Gradesheet Charges
    const numSemestersChecked = data.selectedYears.reduce(
      (total, year) =>
        total + (year.sem1 ? 1 : 0) + (year.sem2 ? 1 : 0) + (year.summerTerm ? 1 : 0),
      0
    );
    const gradesheetCharges = numSemestersChecked * numCopies * 100;

    // Envelope Charges
    let envelopeCharges = data.universities.length * 20;
    const hasDeliverToHome = data.universities.some((u) => u.deliverToHome);
    const extraCopies = numCopies - data.universities.length;

    if (hasDeliverToHome && !data.collectFromBITSGoa) {
      envelopeCharges += 40; // Legal size envelope
    } else if (extraCopies > 0 && !data.collectFromBITSGoa) {
      envelopeCharges += 20; // Additional envelope for extra copies
    }

    // Postal Charges
    let postalCharges = 0;
    if (!data.collectFromBITSGoa) {
      postalCharges += data.universities.reduce((total, university) => {
        if (!university.deliverToHome) {
          switch (university.country) {
            case "India":
              return total + 250;
            case "USA":
            case "Others":
              return total + 3600;
            case "Canada":
              return total + 4200;
            default:
              return total;
          }
        }
        return total;
      }, 0);

      if (hasDeliverToHome || extraCopies > 0) {
        switch (data.homeAddressCountry) {
          case "India":
            postalCharges += 250;
            break;
          case "USA":
          case "Others":
            postalCharges += 3600;
            break;
          case "Canada":
            postalCharges += 4200;
            break;
          default:
            break;
        }
      }
    }

    const totalCharges = gradesheetCharges + envelopeCharges + postalCharges;

    setCalculatedCharges({ gradesheetCharges, envelopeCharges, postalCharges, totalCharges });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    console.log("Calculated Charges:", calculatedCharges);
    alert("Form submitted! Check the console for submitted data.");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1 className="form-title">Gradesheet Application Form</h1>

      {/* Personal Information */}
      <h2>Personal Information</h2>
      <input
        type="text"
        name="idNumber"
        value={formData.idNumber}
        placeholder="ID Number"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Name"
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Email"
        onChange={handleInputChange}
      />
      <input
        type="tel"
        name="mobile"
        value={formData.mobile}
        placeholder="Mobile"
        onChange={handleInputChange}
      />

      {/* Home Address */}
      <h2>Home Address</h2>
      <textarea
        name="homeAddress"
        value={formData.homeAddress}
        placeholder="Home Address"
        onChange={handleInputChange}
      />
      <select
        name="homeAddressCountry"
        value={formData.homeAddressCountry}
        onChange={handleInputChange}
      >
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="numCopies"
        value={formData.numCopies}
        placeholder="Number of Copies"
        onChange={handleInputChange}
      />

      {/* University Details */}
      <h2>University Details</h2>
      <button type="button" onClick={handleAddUniversity}>
        <span className="add-button">+ Add University Details</span>
      </button>
      {formData.universities.map((university, index) => (
        <div key={index} className="university-details">
          <input
            type="text"
            value={university.address}
            placeholder="University Address"
            onChange={(e) =>
              handleUniversityChange(index, "address", e.target.value)
            }
          />
          <select
            value={university.country}
            onChange={(e) =>
              handleUniversityChange(index, "country", e.target.value)
            }
          >
            <option value="">Select Country</option>
            {countries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={university.deliverToHome}
              onChange={(e) =>
                handleUniversityChange(index, "deliverToHome", e.target.checked)
              }
            />
            Deliver to Home Address
          </label>
          <button type="button" onClick={() => handleRemoveUniversity(index)}>
            🗑️
          </button>
        </div>
      ))}

      {/* Academic Years */}
      <h2>Academic Years</h2>
      <div>
        <select
          onChange={(e) => handleYearSelection(e.target.value)}
          value=""
        >
          <option value="">+ Select a New Year</option>
          {years.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {formData.selectedYears.map((yearData, index) => (
        <div key={index} className="year-details">
          <span>{yearData.year}</span>
          <label>
            <input
              type="checkbox"
              checked={yearData.sem1}
              onChange={() => handleYearCheckboxChange(index, "sem1")}
            />
            Semester 1
          </label>
          <label>
            <input
              type="checkbox"
              checked={yearData.sem2}
              onChange={() => handleYearCheckboxChange(index, "sem2")}
            />
            Semester 2
          </label>
          <label>
            <input
              type="checkbox"
              checked={yearData.summerTerm}
              onChange={() => handleYearCheckboxChange(index, "summerTerm")}
            />
            Summer Term
          </label>
          <button type="button" onClick={() => handleYearRemoval(index)}>
            🗑️
          </button>
        </div>
      ))}

      {/* Charges */}
      <h3>Charges</h3>
      <p>Gradesheet Charges: ₹{calculatedCharges.gradesheetCharges}</p>
      <p>Envelope Charges: ₹{calculatedCharges.envelopeCharges}</p>
      <p>Postal Charges: ₹{calculatedCharges.postalCharges}</p>
      <p>Total Charges: ₹{calculatedCharges.totalCharges}</p>
      <label>
        <input
          type="checkbox"
          name="collectFromBITSGoa"
          checked={formData.collectFromBITSGoa}
          onChange={handleInputChange}
        />
        Collect Gradesheet from BITS Goa AUGSD Office
      </label>

      {/* Payment Details */}
      <h2>Payment Details</h2>
      <input
        type="text"
        name="amountPaid"
        value={formData.amountPaid}
        placeholder="Amount Paid"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="sbiDuNumber"
        value={formData.sbiDuNumber}
        placeholder="SBI DU Number"
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="transactionDate"
        value={formData.transactionDate}
        onChange={handleInputChange}
      />

      {/* Submit */}
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default GradesheetApplicationForm;
