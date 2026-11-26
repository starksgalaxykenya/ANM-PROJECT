// ============================================================
// Midnight Reels - Interactive Poster
// ANM 2055 Final Project, Pathway A, Track 3
// ============================================================

console.log("%c🎬 Midnight Reels script loaded", "color:#ffd166; font-weight:bold; font-size:14px;");


// ---------- PART 1: Clickable info cards ----------
// Each card hides its details until the visitor clicks it.

const cards = document.querySelectorAll(".info-card");
console.log("Found", cards.length, "info cards on the page.");

function toggleCard(card) {
  // classList.toggle adds "open" if missing, removes it if present
  card.classList.toggle("open");

  const title = card.querySelector(".card-title").textContent;
  const isOpen = card.classList.contains("open");
  console.log(`Card "${title}" is now ${isOpen ? "OPEN 👀" : "CLOSED 🚪"}`);
}

cards.forEach(function (card, index) {
  card.addEventListener("click", function () {
    console.log(`🖱️ Card ${index + 1} clicked.`);
    toggleCard(card);
  });
});


// ---------- PART 2: Conditional sections (VIP drink / Student ID) ----------
// Show the relevant section depending on which ticket type is selected.

const ticketSelect = document.getElementById("ticketType");
const vipDrinkSection = document.getElementById("vipDrinkSection");
const studentIdSection = document.getElementById("studentIdSection");

console.log("Ticket select element:", ticketSelect);
console.log("VIP drink section element:", vipDrinkSection);
console.log("Student ID section element:", studentIdSection);

function updateConditionalSections() {
  const selected = ticketSelect.value;
  console.log(`🔄 Ticket type changed to: "${selected || "(nothing)"}"`);

  // VIP drink section
  if (selected === "VIP") {
    vipDrinkSection.style.display = "block";
    console.log("   ✅ Showing VIP drink section.");
  } else {
    vipDrinkSection.style.display = "none";
    console.log("   ❌ Hiding VIP drink section.");
  }

  // Student ID section
  if (selected === "Student") {
    studentIdSection.style.display = "block";
    console.log("   ✅ Showing Student ID section.");
  } else {
    studentIdSection.style.display = "none";
    console.log("   ❌ Hiding Student ID section.");
  }
}

// Run once on page load (in case the browser restored a previous selection)
updateConditionalSections();

// Listen for ticket type changes
ticketSelect.addEventListener("change", updateConditionalSections);


// ---------- PART 3: The RSVP webform ----------

const form = document.getElementById("rsvpForm");
const messageBox = document.getElementById("message");

console.log("RSVP form element:", form);
console.log("Message box element:", messageBox);

// Shows a message in the response box.
// type is either "success" or "error" (these match CSS classes).
function showMessage(text, type) {
  messageBox.innerHTML = text;
  messageBox.className = "message " + type;
  console.log(`📩 showMessage() called [${type}]:`, text.replace(/<[^>]+>/g, " ").trim());
}

function handleSubmit(event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  console.log("%c📨 Form submit event fired!", "color:#50c878; font-weight:bold;");

  // --- Read the form values into variables (3 data types) ---
  let visitorName = document.getElementById("visitorName").value.trim();   // string
  let visitorEmail = document.getElementById("visitorEmail").value.trim(); // string
  let guestCount = parseInt(document.getElementById("guestCount").value, 10); // number (integer)
  let ticketType = document.getElementById("ticketType").value;            // string
  let wantsReminder = document.getElementById("wantsReminder").checked;    // boolean

  console.log("📋 Raw form values read:");
  console.log("   visitorName :", visitorName);
  console.log("   visitorEmail:", visitorEmail);
  console.log("   guestCount  :", guestCount, `(type: ${typeof guestCount})`);
  console.log("   ticketType  :", ticketType);
  console.log("   wantsReminder:", wantsReminder, `(type: ${typeof wantsReminder})`);

  // --- VALIDATION (if / else checks) ---
  console.log("🔍 Running validation checks...");

  if (visitorName === "") {
    console.warn("⚠️ Validation failed: name is empty.");
    showMessage("Please enter your name.", "error");
    return;
  } else if (visitorEmail.indexOf("@") === -1 || visitorEmail.indexOf(".") === -1) {
    console.warn("⚠️ Validation failed: email looks invalid ->", visitorEmail);
    showMessage("Please enter a valid email address.", "error");
    return;
  } else if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
    console.warn("⚠️ Validation failed: guestCount out of range ->", guestCount);
    showMessage("Guests must be a whole number from 1 to 10.", "error");
    return;
  } else if (ticketType === "") {
    console.warn("⚠️ Validation failed: no ticket type selected.");
    showMessage("Please choose a ticket type.", "error");
    return;
  }

  console.log("✅ All basic validations passed.");

  // --- VIP DRINK: read preference only if VIP is selected ---
  let vipDrink = null; // string or null

  if (ticketType === "VIP") {
    console.log("🍹 VIP ticket detected – reading drink preference...");
    const drinkRadios = document.getElementsByName("vipDrink");
    for (let i = 0; i < drinkRadios.length; i++) {
      if (drinkRadios[i].checked) {
        vipDrink = drinkRadios[i].value; // "Soda", "Juice", "Water", or "None"
        console.log(`   Selected drink: "${vipDrink}"`);
        break;
      }
    }
    // Fallback in case nothing is checked (should not normally happen)
    if (vipDrink === null) {
      vipDrink = "None";
      console.log("   No drink radio checked – defaulting to \"None\".");
    }
  } else {
    console.log("🍹 Not a VIP ticket – skipping drink preference.");
  }

  // --- STUDENT ID: read value only if Student is selected ---
  let studentId = null; // string or null

  if (ticketType === "Student") {
    console.log("🎓 Student ticket detected – reading Student ID...");
    const studentIdInput = document.getElementById("studentId");
    studentId = studentIdInput.value.trim();
    console.log(`   Student ID entered: "${studentId}"`);

    // Student tickets REQUIRE an ID number
    if (studentId === "") {
      console.warn("⚠️ Validation failed: Student ID is empty.");
      showMessage("Please enter your Student ID number.", "error");
      return;
    }

    console.log("✅ Student ID validation passed.");
  } else {
    console.log("🎓 Not a Student ticket – skipping Student ID.");
  }

  // --- BRANCHING (switch / case) on ticket type ---
  let pricePerTicket;  // number
  let perkMessage;     // string

  console.log(`💰 Branching on ticket type: "${ticketType}"`);

  switch (ticketType) {
    case "General":
      pricePerTicket = 500;
      perkMessage = "Open seating. Arrive early for the best spot!";
      break;
    case "VIP":
      pricePerTicket = 1500;
      perkMessage = "Front-row seats and a meet-and-greet with the animators.";
      break;
    case "Student":
      pricePerTicket = 300;
      perkMessage = "Please bring your student ID to the door.";
      break;
    default:
      pricePerTicket = 0;
      perkMessage = "";
  }

  console.log(`   pricePerTicket = KES ${pricePerTicket}`);
  console.log(`   perkMessage = "${perkMessage}"`);

  let totalPrice = pricePerTicket * guestCount;
  console.log(`   totalPrice = KES ${totalPrice} (${pricePerTicket} × ${guestCount})`);

  // --- Build the response from the visitor's own input ---
  let reminderText;
  if (wantsReminder === true) {
    reminderText = "We will email a reminder to " + visitorEmail + ".";
  } else {
    reminderText = "No reminder email requested.";
  }
  console.log("📧 Reminder text:", reminderText);

  let guestWord = guestCount === 1 ? "seat" : "seats";
  console.log(`🔤 Guest word: "${guestWord}"`);

  let response =
    "<strong>Thanks, " + visitorName + "! You're in.</strong><br>" +
    "You reserved " + guestCount + " " + ticketType + " " + guestWord + ".<br>" +
    "Total: KES " + totalPrice.toLocaleString() + "<br>" +
    perkMessage + "<br>";

  // --- Append VIP drink info only when VIP was chosen ---
  if (ticketType === "VIP") {
    if (vipDrink === "None") {
      response += "🍷 VIP drink: no drink selected.<br>";
    } else {
      response += "🍹 VIP drink preference: " + vipDrink + "<br>";
    }
  }

  // --- Append Student ID info only when Student was chosen ---
  if (ticketType === "Student") {
    response += "🎓 Student ID: " + studentId + "<br>";
  }

  response += reminderText;

  console.log("✅ Building final response complete.");
  showMessage(response, "success");
  console.log("%c🎉 RSVP submitted successfully!", "color:#50c878; font-weight:bold;");
}

form.addEventListener("submit", handleSubmit);