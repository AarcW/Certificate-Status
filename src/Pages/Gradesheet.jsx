import React, { useState } from "react";
import "./FormStyles.css";
import {
  GRADESHEET_COST_PER_SEMESTER,
  A4_ENVELOPE_COST,
  LEGAL_ENVELOPE_COST,
  POSTAL_COSTS,
  YEARS,
  COUNTRIES,
} from "../CostVariables";

// Takes the required data from the student and shows them the Charges that must be paid by handling the complex cost calculation

function GradesheetApplicationForm() {
  const [formData, setFormData] = useState({ //a state to hold all relevant data taken from the form
    idNumber: "",
    name: "",
    email: "",
    mobile: "",
    currentAddress: "",
    currentAddressCountry: "",
    numCopies: 0,
    universities: [],
    selectedYears: [],
    amountPaid: "",
    sbiDuNumber: "",
    transactionDate: "",
    collectFromBITSGoa: false,
    emailGradesheet: false, 
  });

  const [calculatedCharges, setCalculatedCharges] = useState({ // a state to store charges calculations
    gradesheetCharges: 0,
    envelopeCharges: 0,
    postalCharges: 0,
    totalCharges: 0,
  });

  const [errors, setErrors] = useState({ // a state to store errors in filling the form
    amountPaid: "",
    sbiDuNumber: "",
    transactionDate: "",
    idNumber: "",
    email: "",
    mobile: "",
    currentAddress: "",
    currentAddressCountry: "",
    universitiesAddress: "",
    universitiesAddressCountry: "",
    academicYears: "", 
  });

  const countries = COUNTRIES;
  const years = YEARS;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "numCopies") { // constraints on number of copies
      const newCopies = Math.max(0, parseInt(newValue || 0)); // Ensure non-negative value
      const numUniversities = formData.universities.length;
      if (newCopies < numUniversities) {
        alert("The number of copies cannot be less than the number of universities.");
      }

      newValue = newCopies < numUniversities ? numUniversities : newCopies;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "collectFromBITSGoa" && checked) { // changes to calculations if collect from BITS Goa is checked
      calculateCharges({ ...formData, collectFromBITSGoa: true });
    } else {
      calculateCharges({ ...formData, [name]: newValue });
    }
  };

  const handleAddUniversity = () => { // constraints on number of Universities
    if (formData.universities.length >= 10) {
      alert("You can add a maximum of 10 universities.");
      return;
    }
    if (formData.universities.length >= formData.numCopies) {
      alert("You cannot have more universities than number of copies");
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
    const gradesheetCharges = numSemestersChecked * numCopies * GRADESHEET_COST_PER_SEMESTER;

    // Envelope Charges
    let envelopeCharges = data.universities.length * A4_ENVELOPE_COST;
    const hasDeliverToHome = data.universities.some((u) => u.deliverToHome);
    const extraCopies = numCopies - data.universities.length;

    if (hasDeliverToHome && !data.collectFromBITSGoa) {
      envelopeCharges += LEGAL_ENVELOPE_COST; // Legal size envelope
    } else if (extraCopies > 0 && !data.collectFromBITSGoa) {
      envelopeCharges += A4_ENVELOPE_COST; // Additional envelope for extra copies
    }

    // Postal Charges
    let postalCharges = 0;

    if (!data.collectFromBITSGoa) {
      // Calculate postal charges for universities
      postalCharges += data.universities.reduce((total, university) => {
        if (!university.deliverToHome) {
          return total + (POSTAL_COSTS[university.country] || 0); // Default to 0 if country is not found
        }
        return total;
      }, 0);

      // Add postal charges for the current address if needed
      if (hasDeliverToHome || extraCopies > 0) {
        postalCharges += POSTAL_COSTS[data.currentAddressCountry] || 0; // Default to 0 if country is not found
      }
    }

    const totalCharges = gradesheetCharges + envelopeCharges + postalCharges;

    setCalculatedCharges({
      gradesheetCharges,
      envelopeCharges,
      postalCharges,
      totalCharges,
    });
  };

  const validateForm = () => {
    let formIsValid = true; // true if form is filled correctly without missing or incorrect fields
    
      let newErrors = { // state to store error messages to be displayed
        amountPaid: "", 
        sbiDuNumber: "", 
        transactionDate: "", 
        idNumber: "", 
        name: "", 
        email: "", 
        mobile: "", 
        currentAddress: "", 
        currentAddressCountry: "", 
        universitiesAddress: "", 
        academicYears: "", 
      
      };

        // Validation for Academic Years
    if (!formData.selectedYears.length || !formData.selectedYears.some(year => year.sem1 || year.sem2 || year.summerTerm)) {
      newErrors.academicYears = "At least one academic year and one semester must be selected.";
      formIsValid = false;
    }

    // Validate Amount Paid
    if (!formData.amountPaid || isNaN(formData.amountPaid) || parseInt(formData.amountPaid) <= 0) {
      newErrors.amountPaid = "Amount Paid must be a positive integer.";
      formIsValid = false;
    }

    // Validate ID Number (exactly 13 characters)
    if (formData.idNumber.length !== 13) {
      newErrors.idNumber = "ID Number must be exactly 13 characters.";
      formIsValid = false;
    }

    // Validate Email Format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    // Validate Mobile Format (Basic international format validation)
    const mobilePattern = /^[+]?[0-9]{1,4}?[-.\s]?[0-9]{1,14}?$/;
    if (!mobilePattern.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid phone number.";
      formIsValid = false;
    }

    // Validate Amount Paid (integer)
    if (!formData.amountPaid || !Number.isInteger(parseFloat(formData.amountPaid))) {
      newErrors.amountPaid = "Amount Paid must be an integer.";
      formIsValid = false;
    }

    // Validate Transaction Date (should not be beyond today's date)
    if (!formData.transactionDate || new Date(formData.transactionDate) > new Date()) {
      newErrors.transactionDate = "Transaction Date must not be beyond today's date.";
      formIsValid = false;
    }

    // Validate Current Address (cannot be empty)
    if (!formData.currentAddress.trim()) {
      newErrors.currentAddress = "Current Address cannot be empty.";
      formIsValid = false;
    }

    // Validate Current Address Country (cannot be empty)
    if (!formData.currentAddressCountry) {
      newErrors.currentAddress = "Please select a Current Address Country.";
      formIsValid = false;
    }

    // Validate Universities Address (cannot be empty)
    formData.universities.forEach((university, index) => {
      if (!university.address.trim()) {
        newErrors.universitiesAddress = `University Address cannot be empty.`;
        formIsValid = false;
      }
    });

    // Validate Number of Copies (can't be negative)
    if (formData.numCopies <= 0) {
      newErrors.numCopies = "Number of Copies cannot be zero or negative.";
      formIsValid = false;
    }

    // Validate SBI DU Number (cannot be empty)
    if (!formData.sbiDuNumber) {
      newErrors.sbiDuNumber = "Please mention a SBI DU Number.";
      formIsValid = false;
    }

    // Validate University Address Country (cannot be empty)
    formData.universities.forEach((university, index) => {
      if (!university.country.trim()) {
        newErrors.universitiesAddress = `Please select a University Country.`;
        formIsValid = false;
      }
    });

    // Validate name (cannot be empty)
    if (!formData.name) {
      newErrors.name = "Please mention your Name.";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Form submitted successfully!");
    } else {
      alert("Please correct the errors in the form.");
    }
  };

  
  return ( // generates the visible components which use above functions

    <form className="form-container" onSubmit={handleSubmit}>
      <h1 className="form-title">Gradesheet Application Form</h1>
      <br/>
      {/* Personal Information */}
      <h2>Personal Information</h2>
      <input
        type="text"
        name="idNumber"
        value={formData.idNumber}
        placeholder="ID Number"
        onChange={handleInputChange}
      />
      {errors.idNumber && <p className="error-text">{errors.idNumber}</p>}
      
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Name"
        onChange={handleInputChange}
      />
      {errors.name && <p className="error-text">{errors.name}</p>}
      
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Email"
        onChange={handleInputChange}
      />
      {errors.email && <p className="error-text">{errors.email}</p>}
      
      <input
        type="tel"
        name="mobile"
        value={formData.mobile}
        placeholder="Mobile"
        onChange={handleInputChange}
      />
      {errors.mobile && <p className="error-text">{errors.mobile}</p>}
      
      <label>
        <input
          type="checkbox"
          name="emailGradesheet"
          checked={formData.emailGradesheet}
          onChange={handleInputChange}
        />
        E-mail me the Gradesheet 
      </label>
      <br/>
      {/* Current Address */}
      <h2>Current Address</h2>
      <textarea
        name="currentAddress"
        value={formData.currentAddress}
        placeholder="Current Address"
        onChange={handleInputChange}
      />
      
      <select
        name="currentAddressCountry"
        value={formData.currentAddressCountry}
        onChange={handleInputChange}
      >
        
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      {errors.currentAddress && <p className="error-text">{errors.currentAddress}</p>}
      <label>
        <input
          type="checkbox"
          name="collectFromBITSGoa"
          checked={formData.collectFromBITSGoa}
          onChange={handleInputChange}
        />
        Collect Gradesheet from BITS Goa AUGSD Office
      </label>
      
      <h3>Number of Copies of Gradesheet:</h3>    
      <input
        type="number"
        name="numCopies"
        value={formData.numCopies}
        placeholder="Number of Copies"
        onChange={handleInputChange}
      />
      {errors.numCopies && <p className="error-text">{errors.numCopies}</p>}
      <br/><br/>
      {/* University Details */}
      <h2>University Details</h2>
      <br/>
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
            className={errors.universitiesAddress ? "error" : ""}
          >
            
            <option value="">Select Country</option>
            {countries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>

          {errors.universitiesAddress && (
            <p className="error-text">{errors.universitiesAddress}</p>
          )}
          <br/>
          <label>
            <input
              type="checkbox"
              checked={university.deliverToHome}
              onChange={(e) =>
                handleUniversityChange(index, "deliverToHome", e.target.checked)
              }
            />
            Deliver to Current Address
          </label>
          <button type="button" className="dustbin-button" onClick={() => handleRemoveUniversity(index)}>
            🗑️
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddUniversity}>
      <span className="add-button">+ Add University Details</span>
      </button>
      <br/><br/>

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
          <button type="button" className="dustbin-button" onClick={() => handleYearRemoval(index)}>
            🗑️
          </button>

        </div>
      ))}
            {errors.academicYears && <p className="error-text">{errors.academicYears}</p>}


      {/* Charges */}
      <h3>Charges</h3>
      <p>Gradesheet Charges: ₹{calculatedCharges.gradesheetCharges}</p>
      <p>Envelope Charges: ₹{calculatedCharges.envelopeCharges}</p>
      <p>Postal Charges: ₹{calculatedCharges.postalCharges}</p>
      <p>Total Charges: ₹{calculatedCharges.totalCharges}</p>
      

      {/* Payment Details */}
      <h2>Payment Details</h2>
      <input
        type="text"
        name="amountPaid"
        value={formData.amountPaid}
        placeholder="Amount Paid"
        onChange={handleInputChange}
      />
      {errors.amountPaid && <p className="error-text">{errors.amountPaid}</p>}

      <input
        type="text"
        name="sbiDuNumber"
        value={formData.sbiDuNumber}
        placeholder="SBI DU Number"
        onChange={handleInputChange}
      />
      {errors.sbiDuNumber && <p className="error-text">{errors.sbiDuNumber}</p>}

      <input
        type="date"
        name="transactionDate"
        value={formData.transactionDate}
        onChange={handleInputChange}
      />
      {errors.transactionDate && <p className="error-text">{errors.transactionDate}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit-button" onClick={console.log(formData)}>
        Submit
      </button>
    </form>
  );
}

export default GradesheetApplicationForm;
