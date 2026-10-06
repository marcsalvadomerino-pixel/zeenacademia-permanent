const form = document.querySelector("#orientation-form");
const success = document.querySelector("#form-success");
const applicantType = document.querySelector("#applicant-type");
const interest = document.querySelector("#interest");
const currentYear = document.querySelector("#year");
const fundaeEstimator = document.querySelector("#fundae-estimator");
const fundaeHeadcount = document.querySelector("#fundae-headcount");
const fundaeContributionBase = document.querySelector("#fundae-contribution-base");
const fundaeResult = document.querySelector("#fundae-result");
const fundaeCreditEstimate = document.querySelector("#fundae-credit-estimate");

const FUNDAE_RATES = [
  { max: 5, rate: null, minimum: 420, label: "1 a 5 persones" },
  { max: 9, rate: 1, label: "6 a 9 persones" },
  { max: 49, rate: 0.75, label: "10 a 49 persones" },
  { max: 249, rate: 0.6, label: "50 a 249 persones" },
  { max: Infinity, rate: 0.5, label: "250 o més persones" }
];

let lastEstimatedAmount = null;

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function track(eventName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName });
}

function euro(value) {
  return new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function setFundaeResult(message, isReady = false) {
  if (!fundaeResult) return;
  fundaeResult.textContent = message;
  fundaeResult.dataset.state = isReady ? "ready" : "pending";
}

function getFundaeRate(headcount) {
  return FUNDAE_RATES.find((band) => headcount <= band.max);
}

function updateFundaeEstimate() {
  if (!fundaeHeadcount || !fundaeContributionBase || !fundaeCreditEstimate) return;

  const headcount = Number.parseInt(fundaeHeadcount.value, 10);
  const contributionBase = Number.parseFloat(fundaeContributionBase.value);
  fundaeCreditEstimate.value = "";

  if (!Number.isInteger(headcount) || headcount < 1) {
    lastEstimatedAmount = null;
    setFundaeResult("Indica la plantilla per veure la regla aplicable.");
    return;
  }

  const band = getFundaeRate(headcount);
  if (band.minimum) {
    fundaeCreditEstimate.value = band.minimum.toFixed(2);
    if (lastEstimatedAmount !== band.minimum) track("fundae_estimate_calculated");
    lastEstimatedAmount = band.minimum;
    setFundaeResult(`Crèdit orientatiu: ${euro(band.minimum)}. FUNDAE estableix aquest mínim per a empreses d’1 a 5 persones treballadores.`, true);
    return;
  }

  if (!Number.isFinite(contributionBase) || contributionBase <= 0) {
    lastEstimatedAmount = null;
    const rateLabel = `${Math.round(band.rate * 100)} %`;
    setFundaeResult(`Per a una plantilla de ${band.label}, la regla orientativa és el ${rateLabel} de la quota de formació professional de l’any anterior. Afegeix la base d’«altres cotitzacions» per estimar l’import.`);
    return;
  }

  const trainingContribution = contributionBase * 0.007;
  const estimate = trainingContribution * band.rate;
  fundaeCreditEstimate.value = estimate.toFixed(2);
  if (lastEstimatedAmount !== estimate) track("fundae_estimate_calculated");
  lastEstimatedAmount = estimate;
  setFundaeResult(`Crèdit FUNDAE orientatiu: ${euro(estimate)}. Càlcul: base d’«altres cotitzacions» × 0,7 % × ${Math.round(band.rate * 100)} % (${band.label}).`, true);
}

function updateFundaeVisibility() {
  if (!fundaeEstimator || !fundaeHeadcount) return;
  const companyRequest = applicantType?.value === "empresa" || interest?.value === "fundae";
  fundaeEstimator.hidden = !companyRequest;
  fundaeHeadcount.required = companyRequest;

  if (companyRequest) {
    updateFundaeEstimate();
    return;
  }

  fundaeHeadcount.value = "";
  if (fundaeContributionBase) fundaeContributionBase.value = "";
  if (fundaeCreditEstimate) fundaeCreditEstimate.value = "";
  lastEstimatedAmount = null;
}

function applyInterestFromLink(link) {
  const selectedInterest = link.dataset.interest;
  if (!selectedInterest || !interest) return;

  const matchingOption = [...interest.options].find((option) => option.value === selectedInterest);
  if (matchingOption) interest.value = selectedInterest;
  if (selectedInterest === "empresa" || selectedInterest === "fundae") applicantType.value = "empresa";
  if (selectedInterest === "particular" || selectedInterest === "experiencia") applicantType.value = "particular";
  updateFundaeVisibility();
}

document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => applyInterestFromLink(link));
});

document.querySelectorAll('a[href="#orientacio"]').forEach((link) => {
  link.addEventListener("click", () => track("click_primary_cta"));
});

document.querySelectorAll('a[href="#empreses"]').forEach((link) => {
  link.addEventListener("click", () => track("click_fundae"));
});

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => track("phone_click"));
});

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => track("email_click"));
});

[applicantType, interest].forEach((field) => {
  field?.addEventListener("change", updateFundaeVisibility);
});

[fundaeHeadcount, fundaeContributionBase].forEach((field) => {
  field?.addEventListener("input", updateFundaeEstimate);
});

const isPreview = location.hostname.includes("manus.computer") || location.hostname === "localhost";
const isSuccessState = new URLSearchParams(location.search).get("success") === "1";

function showConfirmation() {
  if (!form || !success) return;
  form.hidden = true;
  success.hidden = false;
  success.focus();
}

if (isSuccessState) {
  showConfirmation();
}

if (form) {
  form.addEventListener("focusin", () => track("form_start"), { once: true });
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    track("form_submit");
    if (isPreview) {
      event.preventDefault();
      showConfirmation();
    }
  });
}

updateFundaeVisibility();
track("view_landing");
