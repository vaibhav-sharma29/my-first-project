// === Navigation ===
function showSection(id) {
  document.querySelectorAll('.content').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// === Fuzzy Spell Match Helper ===
function similarity(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase();
  b = b.toLowerCase();
  let same = 0;
  for (let ch of a) if (b.includes(ch)) same++;
  return same / Math.max(a.length, b.length);
}

// === Symptom Database (few samples, can expand easily) ===
const symptomDB = {
  "Common Cold": {
    symptoms: ["runny nose", "sneezing", "sore throat", "mild fever", "cough"],
    cure: "Rest, drink warm fluids, take steam, use mild paracetamol if needed.",
    avoid: "Cold drinks, dust, late nights, sudden temperature change."
  },
  "Flu": {
    symptoms: ["high fever", "body ache", "chills", "fatigue", "dry cough", "headache"],
    cure: "Rest, hydration, warm soup, and paracetamol. If severe, consult doctor.",
    avoid: "Cold air, crowds, and dehydration."
  },
  "Dengue": {
    symptoms: ["high fever", "rash", "joint pain", "muscle pain", "vomiting", "eye pain"],
    cure: "Drink plenty of fluids, use paracetamol (not aspirin), and rest well.",
    avoid: "Mosquito bites, painkillers like ibuprofen, dehydration."
  },
  "Malaria": {
    symptoms: ["fever with chills", "sweating", "headache", "nausea", "body ache"],
    cure: "Take antimalarial medicine as prescribed, drink fluids, rest.",
    avoid: "Mosquito bites, unclean water."
  },
  "Jaundice": {
    symptoms: ["yellow eyes", "yellow skin", "dark urine", "fatigue", "abdominal pain"],
    cure: "Light diet, coconut water, rest, and regular liver check-up.",
    avoid: "Fried or oily food, alcohol, late-night eating."
  },
  "Typhoid": {
    symptoms: ["fever", "abdominal pain", "weakness", "loss of appetite", "headache"],
    cure: "Antibiotics (doctor prescribed), eat soft food, drink boiled water.",
    avoid: "Street food, unboiled water, spicy items."
  },
  "Swine Flu": {
    symptoms: ["fever", "cough", "sore throat", "body pain", "chills", "runny nose"],
    cure: "Rest, hydration, antiviral medicine (doctor prescribed).",
    avoid: "Contact with infected people, public gatherings."
  },
  "COVID-19": {
    symptoms: ["fever", "dry cough", "loss of smell", "loss of taste", "fatigue"],
    cure: "Isolation, hydration, paracetamol, rest.",
    avoid: "Crowds, no mask, unhealthy food."
  },
  "Asthma": {
    symptoms: ["shortness of breath", "wheezing", "chest tightness", "night cough"],
    cure: "Use inhaler, stay calm, avoid triggers.",
    avoid: "Dust, smoke, cold air, strong perfumes."
  },
  "Acidity": {
    symptoms: ["heartburn", "sour burps", "chest burning", "stomach discomfort"],
    cure: "Eat light meals, avoid spicy food, drink cold milk.",
    avoid: "Coffee, oily foods, lying down right after eating."
  },
  "Migraine": {
    symptoms: ["headache", "nausea", "light sensitivity", "aura", "vomiting"],
    cure: "Rest in a dark room, take prescribed pain reliever, stay hydrated.",
    avoid: "Stress, skipping meals, loud noise."
  },
  "Fracture (Crack Bones)": {
    symptoms: ["severe pain", "inability to move", "bone deformity","crack bone","bone crack"],
    cure: "Immobilize the part, apply ice, seek hospital treatment immediately.",
    avoid: "Pressing or moving the injured part."
  },
  "Eyesight Weakness": {
    symptoms: ["blurry vision", "headache", "eye strain", "difficulty reading","eye swelling","red eyes","eye redness"],
    cure: "Use prescribed glasses, eat vitamin A foods like carrots, rest eyes.",
    avoid: "Long screen time, reading in dim light."
  },
  "Anemia": {
    symptoms: ["weakness", "fatigue", "pale skin", "dizziness", "cold hands"],
    cure: "Eat iron-rich food (spinach, beetroot), take iron supplements.",
    avoid: "Skipping meals, low-nutrition diet."
  },
  "Diabetes": {
    symptoms: ["frequent urination", "excessive thirst", "weight loss", "fatigue"],
    cure: "Exercise regularly, controlled diet, insulin/medication as prescribed.",
    avoid: "Sugary food, junk food, irregular meals."
  },
  "Hypertension (High BP)": {
    symptoms: ["headache", "dizziness", "blurred vision", "nosebleed sometimes"],
    cure: "Reduce salt, exercise, take BP medicine regularly.",
    avoid: "Stress, alcohol, smoking, salty food."
  },
  "Heart Disease": {
    symptoms: ["chest pain", "shortness of breath", "fatigue", "palpitations"],
    cure: "Consult cardiologist, eat low-fat diet, regular exercise.",
    avoid: "Smoking, oily food, stress, late-night eating."
  },
  "Pneumonia": {
    symptoms: ["fever", "cough with mucus", "chest pain", "difficulty breathing"],
    cure: "Antibiotics (doctor), steam inhalation, rest, fluids.",
    avoid: "Cold air, dusty places."
  },
  "Tuberculosis (TB)": {
    symptoms: ["long cough", "blood in sputum", "weight loss", "night sweats"],
    cure: "6-month antibiotic course (doctor prescribed), nutrition, rest.",
    avoid: "Skipping medicine, close contact in enclosed rooms."
  },
  "Food Poisoning": {
    symptoms: ["vomiting", "diarrhea", "abdominal cramps", "nausea","stomach ache"],
    cure: "Drink ORS, avoid solid food for few hours, rest.",
    avoid: "Street food, stale food, unfiltered water."
  },
  "Skin Allergy": {
    symptoms: ["itching", "rashes", "redness", "burning sensation"],
    cure: "Apply soothing lotion, antihistamine tablet (if prescribed).",
    avoid: "Dust, harsh soaps, scratching."
  },
  "Dehydration": {
    symptoms: ["dry mouth", "dizziness", "fatigue", "low urine", "thirst"],
    cure: "Drink water, ORS, fruit juices.",
    avoid: "Sun exposure, caffeine, skipping water intake."
  }
};

// === Check Symptoms (with fuzzy matching) ===
function checkSymptoms() {
  const input = document.getElementById("symptomInput").value.toLowerCase().trim();
  const res = document.getElementById("resultBox");

  if (!input) return res.innerHTML = "⚠️ Please enter a symptom.";

  let matches = [];

  for (let disease in symptomDB) {
    for (let s of symptomDB[disease].symptoms) {
      const sim = similarity(input, s);
      if (sim > 0.5 || s.includes(input) || input.includes(s)) {
        matches.push({
          name: disease,
          cure: symptomDB[disease].cure,
          avoid: symptomDB[disease].avoid
        });
        break;
      }
    }
  }

  if (matches.length === 0)
    return res.innerHTML = `❌ No match found for "${input}". Try similar terms like fever, pain, cough, etc.`;

  let html = "<h3>🧾 Possible Conditions</h3>";
  matches.forEach(m => {
    html += `<div class="result-item">
      <b>${m.name}</b><br>
      🩹 <b>Cure:</b> ${m.cure}<br>
      🚫 <b>Avoid:</b> ${m.avoid}
    </div>`;
  });

  html += `<p class="disclaimer">📘 Data is for awareness. Always consult a doctor for serious cases.</p>`;
  res.innerHTML = html;
}

// === Loading Animation ===
function showLoading(id) {
  const el = document.getElementById(id);
  el.innerHTML = "<div class='loading'>⏳ Checking...</div>";
  setTimeout(() => (el.innerHTML = ""), 600);
}
// === Nutrition Information Database (150+ Foods) ===
const nutritionDB = {
"apple": {cal: 52, protein: 0.3, fat: 0.2, carbs: 14, vitamins: "C"},
  "banana": {cal: 89, protein: 1.1, fat: 0.3, carbs: 23, vitamins: "B6, C"},
  "orange": {cal: 47, protein: 0.9, fat: 0.1, carbs: 12, vitamins: "C"},
  "mango": {cal: 60, protein: 0.8, fat: 0.4, carbs: 15, vitamins: "A, C, E"},
  "grapes": {cal: 69, protein: 0.6, fat: 0.2, carbs: 18, vitamins: "C, K"},
  "watermelon": {cal: 30, protein: 0.6, fat: 0.2, carbs: 8, vitamins: "A, C"},
  "papaya": {cal: 43, protein: 0.5, fat: 0.3, carbs: 11, vitamins: "A, C, E"},
  "kiwi": {cal: 41, protein: 0.8, fat: 0.4, carbs: 10, vitamins: "C, E"},
  "pomegranate": {cal: 83, protein: 1.7, fat: 1.2, carbs: 19, vitamins: "C, K"},
  "strawberry": {cal: 32, protein: 0.7, fat: 0.3, carbs: 8, vitamins: "C, B9"},
  "pineapple": {cal: 50, protein: 0.5, fat: 0.1, carbs: 13, vitamins: "C, B1"},
  "guava": {cal: 68, protein: 2.6, fat: 1, carbs: 14, vitamins: "A, C"},
  "lemon": {cal: 29, protein: 1.1, fat: 0.3, carbs: 9, vitamins: "C"},

  // 🥦 VEGETABLES
  "spinach": {cal: 23, protein: 2.9, fat: 0.4, carbs: 3.6, vitamins: "A, C, K, Iron"},
  "broccoli": {cal: 34, protein: 2.8, fat: 0.4, carbs: 7, vitamins: "C, K, B9"},
  "tomato": {cal: 18, protein: 0.9, fat: 0.2, carbs: 4, vitamins: "A, C, K"},
  "carrot": {cal: 41, protein: 0.9, fat: 0.2, carbs: 10, vitamins: "A, K"},
  "potato": {cal: 77, protein: 2, fat: 0.1, carbs: 17, vitamins: "C, B6"},
  "onion": {cal: 40, protein: 1.1, fat: 0.1, carbs: 9, vitamins: "C, B6"},
  "cucumber": {cal: 16, protein: 0.6, fat: 0.1, carbs: 4, vitamins: "K"},
  "peas": {cal: 81, protein: 5.4, fat: 0.4, carbs: 14, vitamins: "A, C, K"},
  "corn": {cal: 86, protein: 3.3, fat: 1.2, carbs: 19, vitamins: "B1, B9"},
  "cabbage": {cal: 25, protein: 1.3, fat: 0.1, carbs: 6, vitamins: "C, K"},
  "cauliflower": {cal: 25, protein: 1.9, fat: 0.3, carbs: 5, vitamins: "C, K"},

  // 🥛 DAIRY & PROTEINS
  "milk": {cal: 42, protein: 3.4, fat: 1, carbs: 5, vitamins: "B2, D, Calcium"},
  "curd": {cal: 60, protein: 3.5, fat: 3, carbs: 4, vitamins: "B12, Calcium"},
  "paneer": {cal: 265, protein: 18, fat: 20, carbs: 1.2, vitamins: "B12, Calcium"},
  "egg": {cal: 155, protein: 13, fat: 11, carbs: 1.1, vitamins: "A, D, B12"},
  "chicken": {cal: 239, protein: 27, fat: 14, carbs: 0, vitamins: "B3, B6"},
  "fish": {cal: 206, protein: 22, fat: 12, carbs: 0, vitamins: "D, B12"},
  "lentils": {cal: 116, protein: 9, fat: 0.4, carbs: 20, vitamins: "B9, Iron"},
  "tofu": {cal: 76, protein: 8, fat: 4.8, carbs: 1.9, vitamins: "Calcium, Iron"},
  "soybeans": {cal: 446, protein: 36, fat: 20, carbs: 30, vitamins: "B1, B9, Iron"},

  // 🍚 STAPLE FOODS
  "rice": {cal: 130, protein: 2.7, fat: 0.3, carbs: 28, vitamins: "B1"},
  "wheat_roti": {cal: 110, protein: 3.6, fat: 0.5, carbs: 22, vitamins: "B1, B3"},
  "dal": {cal: 120, protein: 9, fat: 1, carbs: 18, vitamins: "B9, Iron"},
  "poha": {cal: 110, protein: 2.5, fat: 1, carbs: 25, vitamins: "B1, Iron"},
  "dosa": {cal: 168, protein: 3.9, fat: 6.8, carbs: 25, vitamins: "B1, B9"},
  "idli": {cal: 58, protein: 2, fat: 0.4, carbs: 12, vitamins: "B1, B9"},
  "upma": {cal: 155, protein: 4, fat: 5, carbs: 23, vitamins: "B1, B3"},
  "dal_chawal": {cal: 180, protein: 7, fat: 3, carbs: 28, vitamins: "B1, Iron"},
  "khichdi": {cal: 120, protein: 4, fat: 2, carbs: 20, vitamins: "B1, B9"},

  // 🥜 NUTS & SEEDS
  "almonds": {cal: 579, protein: 21, fat: 50, carbs: 22, vitamins: "E, B2, Magnesium"},
  "walnuts": {cal: 654, protein: 15, fat: 65, carbs: 14, vitamins: "E, B6, Omega-3"},
  "cashew": {cal: 553, protein: 18, fat: 44, carbs: 30, vitamins: "E, K, Magnesium"},
  "peanuts": {cal: 567, protein: 26, fat: 49, carbs: 16, vitamins: "E, B3"},
  "chia_seeds": {cal: 486, protein: 17, fat: 31, carbs: 42, vitamins: "Omega-3, Calcium"},

  // 🍞 SNACKS & SWEETS
  "bread": {cal: 265, protein: 9, fat: 3.2, carbs: 49, vitamins: "B1, B3"},
  "butter": {cal: 717, protein: 0.9, fat: 81, carbs: 0.1, vitamins: "A, D, E"},
  "jam": {cal: 250, protein: 0.4, fat: 0.1, carbs: 65, vitamins: "C"},
  "honey": {cal: 304, protein: 0.3, fat: 0, carbs: 82, vitamins: "B2, B6"},
  "chocolate": {cal: 546, protein: 4.9, fat: 31, carbs: 61, vitamins: "B2, Magnesium"},
  "dark_chocolate": {cal: 598, protein: 7.8, fat: 42, carbs: 46, vitamins: "Iron, Magnesium, Antioxidants"},
  "biscuits": {cal: 480, protein: 6, fat: 20, carbs: 70, vitamins: "B1, B3"},
  "ice_cream": {cal: 207, protein: 3.5, fat: 11, carbs: 24, vitamins: "A, D"},
  "burger": {cal: 295, protein: 17, fat: 14, carbs: 27, vitamins: "B3, B12"},
  "pizza": {cal: 266, protein: 11, fat: 10, carbs: 33, vitamins: "B1, B3"},
  "fries": {cal: 312, protein: 3.4, fat: 15, carbs: 41, vitamins: "C, B6"},

  // ☕ BEVERAGES / DRINKS
  "water": {cal: 0, protein: 0, fat: 0, carbs: 0, vitamins: "—"},
  "tea": {cal: 1, protein: 0, fat: 0, carbs: 0.3, vitamins: "B2, Polyphenols"},
  "coffee": {cal: 2, protein: 0.1, fat: 0, carbs: 0, vitamins: "B2"},
  "milk_tea": {cal: 40, protein: 1, fat: 1, carbs: 6, vitamins: "B2, D"},
  "green_tea": {cal: 1, protein: 0, fat: 0, carbs: 0.2, vitamins: "C, Antioxidants"},
  "black_coffee": {cal: 2, protein: 0.1, fat: 0, carbs: 0, vitamins: "B2"},
  "lemon_water": {cal: 5, protein: 0.1, fat: 0, carbs: 1.5, vitamins: "C"},
  "coconut_water": {cal: 19, protein: 0.7, fat: 0.2, carbs: 4, vitamins: "C, B9"},
  "buttermilk": {cal: 40, protein: 3.3, fat: 1, carbs: 5, vitamins: "B2, Calcium"},
  "lassi": {cal: 120, protein: 3.5, fat: 4, carbs: 17, vitamins: "B12, Calcium"},
  "fruit_juice": {cal: 45, protein: 0.5, fat: 0.2, carbs: 11, vitamins: "C"},
  "smoothie": {cal: 90, protein: 2, fat: 1, carbs: 18, vitamins: "C, B6"},
  "soda": {cal: 41, protein: 0, fat: 0, carbs: 10, vitamins: "—"},
  "energy drink": {cal: 45, protein: 0, fat: 0, carbs: 11, vitamins: "B3, B6"},
  "protein shake": {cal: 120, protein: 20, fat: 2, carbs: 5, vitamins: "B12, D"},
  "milkshake": {cal: 180, protein: 6, fat: 6, carbs: 26, vitamins: "A, D"}
  
  // Continue with more as desired…
};

function showNutrition() {
  const input = document.getElementById("nutritionInput").value.toLowerCase().trim();
  const box = document.getElementById("nutritionBox");
  if (!input) return (box.innerHTML = "⚠️ Enter a food item.");

  let found = null;
  let inputName = "";
  for (let food in nutritionDB) {
    if (food.includes(input) || input.includes(food)) {
      found = nutritionDB[food];
      inputName = food;
      break;
    }
  }

  if (!found)
    return (box.innerHTML = `No nutrition data for <b>${input}</b>. Try 'apple', 'rice', 'milk', etc.`);

  box.innerHTML = `
    <h3>🥗 Nutrition of ${inputName.charAt(0).toUpperCase() + inputName.slice(1)}</h3>
    <ul>
      <li>Calories: ${found.cal} kcal</li>
      <li>Protein: ${found.protein} g</li>
      <li>Fat: ${found.fat} g</li>
      <li>Carbs: ${found.carbs} g</li>
      <li>Vitamins: ${found.vitamins}</li>
    </ul>`;
}


// === BMI & CALORIES ===
function calcBMI() {
  const h = parseFloat(document.getElementById('height').value);
  const w = parseFloat(document.getElementById('weight').value);
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const activity = parseFloat(document.getElementById('activity').value);

  const bmiBox = document.getElementById('bmiResult');
  const calBox = document.getElementById('calorieResult');

  if (!h || !w || !age) {
    bmiBox.innerHTML = "<p>Please fill all fields correctly.</p>";
    return;
  }

  const bmi = w / ((h / 100) ** 2);
  let category = "";
  if (bmi < 18.5) category = "Underweight 🦴";
  else if (bmi < 24.9) category = "Normal Weight 💪";
  else if (bmi < 29.9) category = "Overweight ⚠️";
  else category = "Obese 🚨";

  bmiBox.innerHTML = `<p><strong>Your BMI:</strong> ${bmi.toFixed(1)} (${category})</p>`;

  // Mifflin-St Jeor Formula
  let bmr;
  if (gender === "male")
    bmr = 10 * w + 6.25 * h - 5 * age + 5;
  else
    bmr = 10 * w + 6.25 * h - 5 * age - 161;

  const maintenance = Math.round(bmr * activity);
  calBox.innerHTML = `<p><strong>Estimated Maintenance Calories:</strong> ${maintenance} kcal/day</p>`;
}


// === Daily Health Tips ===
const tips = [
  "Drink 8 glasses of water daily 💧",
  "Sleep at least 7 hours 💤",
  "Avoid junk food 🍟",
  "Do 30 mins of exercise 🏃‍♂️",
  "Eat fruits and vegetables 🥦",
  "Take deep breaths and relax 🧘",
  "Wash hands before eating 👐",
  "Avoid screens before bed 📵",
  "Have a morning walk 🌤️",
  "Smile often — it lowers stress 😊"
];

function dailyTip() {
  const t = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById("tipBox").innerHTML = t;
}

// === FIRST AID ===
const firstAidData = {
  "Cut or Wound": "🩹 Clean with water, apply antiseptic, and cover with sterile gauze. Seek medical help if bleeding is heavy.",
  "Nose Bleeding": "🩸 Sit upright, lean forward, pinch soft nose for 10 mins. Avoid lying down.",
  "Burns (Minor)": "🔥 Cool under running water for 10 mins, don’t apply toothpaste. Use burn ointment.",
  "Fracture (Broken Bone)": "🦴 Keep limb still, don’t move or straighten. Support with cloth and call emergency services.",
  "Fainting": "💤 Lay person flat, raise legs, loosen tight clothes, ensure airflow. If not responsive, seek help.",
  "Sprain or Strain": "🦶 Rest the part, apply ice, compress lightly, and elevate (RICE method).",
  "Insect Bite or Sting": "🐝 Wash area, apply ice, and calamine lotion. If swelling or difficulty breathing, call emergency.",
  "Poisoning": "☠️ Do not induce vomiting unless told. Keep sample of poison and call poison control.",
  "Electric Shock": "⚡ Turn off power source first! Don’t touch victim directly. Check breathing and call emergency.",
  "Eye Injury / Dust in Eye": "👁️ Rinse gently with clean water. Don’t rub. If pain persists, see an eye doctor."
};

function showFirstAid() {
  const problem = document.getElementById("aidSelect").value;
  const aidResult = document.getElementById("aidResult");
  if (!problem) {
    aidResult.innerHTML = "";
    return;
  }
  aidResult.innerHTML = `<div class='result-item'>${firstAidData[problem] || "Information not available."}</div>`;
}
// === Partial Keyword Symptom Matching + Output ===
function checkSymptoms() {
  const input = document.getElementById("symptomInput").value.toLowerCase().trim();
  const resultBox = document.getElementById("resultBox");
  if (!input) return (resultBox.innerHTML = "⚠️ Please enter at least one symptom.");

  let possible = [];

  for (let disease in symptomDB) {
    const s = symptomDB[disease].symptoms;
    for (let i = 0; i < s.length; i++) {
      if (s[i].includes(input) || input.includes(s[i])) {
        possible.push({
          name: disease,
          cure: symptomDB[disease].cure,
          avoid: symptomDB[disease].avoid,
        });
        break;
      }
    }
  }

  if (possible.length === 0) {
    resultBox.innerHTML = `❌ No exact match found for "${input}". Try keywords like fever, cough, pain, etc.`;
    return;
  }

  let html = "<h3>🩺 Possible Conditions</h3>";
  possible.slice(0, 3).forEach((p) => {
    html += `<div class="result-item">
      <b>${p.name}</b><br>
      🩹 <b>Possible Cure:</b> ${p.cure}<br>
      🚫 <b>Avoid:</b> ${p.avoid}<br><br>
    </div>`;
  });

  html += `<p class="disclaimer">
  ⚠️ Data is based on general human studies and WHO guidelines. 
  Always consult a certified doctor in severe or uncertain cases.
  </p>`;

  resultBox.innerHTML = html;
}

// === Simple Loading Animation Handler ===
function showLoading(id) {
  const el = document.getElementById(id);
  el.innerHTML = "<div class='loading'>⏳ Loading...</div>";
  setTimeout(() => el.innerHTML = "", 600);
}
// === MULTI-COUNTRY EMERGENCY ALERT ===
function emergencyAlert() {
  const country = prompt("🌍 Enter your country name (e.g., India, USA, China, Russia, UK, Australia):").toLowerCase().trim();

  const emergencyNumbers = {
    "india": "🚑 Ambulance: 102 | Medical Emergency: 108",
    "usa": "🚑 Medical Emergency: 911",
    "china": "🚑 Medical Emergency: 120",
    "russia": "🚑 Medical Emergency: 103",
    "uk": "🚑 NHS Emergency: 999",
    "australia": "🚑 Medical Emergency: 000",
    "canada": "🚑 Medical Emergency: 911",
    "japan": "🚑 Medical Emergency: 119",
    "germany": "🚑 Medical Emergency: 112",
    "france": "🚑 Medical Emergency: 15",
  };

  const info = emergencyNumbers[country] || "⚠️ Emergency numbers not found. Use your local emergency helpline.";
  alert(info);
}

// === Small Interaction Boost ===
document.addEventListener("DOMContentLoaded", () => {
  const greetBox = document.getElementById("greetBox");
  if (greetBox) {
    const hrs = new Date().getHours();
    let greet = "Welcome!";
    if (hrs < 12) greet = "Good Morning ☀️";
    else if (hrs < 17) greet = "Good Afternoon 🌤️";
    else greet = "Good Evening 🌙";
    greetBox.innerHTML = `${greet} <br>Stay healthy and take care!`;
  }
});
// function showSection(sectionId) {
//   const sections = document.querySelectorAll(".content");
//   sections.forEach(sec => sec.style.display = "none");

//   const selected = document.getElementById(sectionId);
//   if (selected) selected.style.display = "block";
// }

// // Simple login functionality
// function loginUser() {
//   const username = document.getElementById("username").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();
//   const message = document.getElementById("loginMessage");

//   if (username === "" || email === "" || password === "") {
//     message.style.color = "red";
//     message.textContent = "⚠️ Please fill all fields!";
//   } else {
//     message.style.color = "green";
//     message.textContent = `✅ Welcome, ${username}! You are logged in.`;
//     // Optionally hide the form after login
//     setTimeout(() => {
//       document.getElementById("loginSection").style.display = "none";
//     }, 2000);
//   }
// }
function showSection(sectionId) {
  document.querySelectorAll(".content").forEach(sec => sec.classList.add("hidden"));
  const selected = document.getElementById(sectionId);
  selected.classList.remove("hidden");
  selected.style.display = "block";
}

function clearLoginForm() {
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginMessage").textContent = "";
}

function loginUser() {
  const username = (document.getElementById("username").value || "").trim();
  const email = (document.getElementById("email").value || "").trim();
  const password = (document.getElementById("password").value || "").trim();
  const msg = document.getElementById("loginMessage");

  if (!username || !email || !password) {
    msg.style.color = "crimson";
    msg.textContent = "⚠️ Please fill all fields.";
    return;
  }

  // Save user
  localStorage.setItem("healthUser", username);
  msg.style.color = "green";
  msg.textContent = `✅ Welcome, ${username}!`;

  // Show profile section
  showProfile(username);

  // Hide login section & login button safely
  const loginSection = document.getElementById("loginSection");
  const loginBtn = document.getElementById("loginBtn");
  if (loginSection) {
    loginSection.classList.add("hidden");
    loginSection.style.display = "none";

  }
  if (loginBtn) {
    loginBtn.classList.add("hidden");
    loginBtn.style.display = "none";
  }
}

function showProfile(username) {
  const prof = document.getElementById("profileSection");
  const circle = document.getElementById("profileCircle");
  const nameEl = document.getElementById("profileName");

  circle.textContent = (username.charAt(0) || "").toUpperCase();
  nameEl.textContent = username;
  prof.classList.remove("hidden");
  prof.setAttribute("aria-hidden", "false");
}

function logoutUser() {
  localStorage.removeItem("healthUser");

  const prof = document.getElementById("profileSection");
  const loginBtn = document.getElementById("loginBtn");

  prof.classList.add("hidden");
  prof.setAttribute("aria-hidden", "true");

  if (loginBtn) {
    loginBtn.classList.remove("hidden");
    loginBtn.style.display = "inline-block";
    // loginBtn.style.filter="blur(5px)";
  }

  alert("You have been logged out.");
}

document.addEventListener("click", e => {
  if (e.target && e.target.id === "logoutBtn") logoutUser();
});

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("healthUser");
  if (saved) {
    showProfile(saved);
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.classList.add("hidden");
      loginBtn.style.display = "none";
    }
  }
  showSection("symptomSection");
});

document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id === "password") loginUser();
});
function calcHealthScore() {
  const act = parseInt(document.getElementById('activityLevel').value);
  const water = parseInt(document.getElementById('waterIntake').value);
  const sleep = parseInt(document.getElementById('sleepHours').value);
  
  if (!act || !water || !sleep) {
    alert("⚠️ Please answer all questions!");
    return;
  }

  const score = (act + water + sleep) / 9 * 100;
  const scoreBar = document.getElementById('scoreBar');
  const scoreContainer = document.getElementById('scoreContainer');
  const scoreResult = document.getElementById('scoreResult');

  scoreBar.style.width = '0%';
  scoreContainer.style.display = 'block';
  let progress = 0;

  const interval = setInterval(() => {
    if (progress >= score) {
      clearInterval(interval);
      scoreResult.innerHTML = `🩺 Your AI Health Score: <b>${Math.round(score)}%</b> — ${
        score > 80 ? "Excellent! 🌟" : score > 50 ? "Good 🙂" : "Needs Improvement 💧"
      }`;
    } else {
      progress++;
      scoreBar.style.width = progress + "%";
    }
  }, 10);
}
function getDietAdvice() {
  const goal = document.getElementById('dietGoal').value.toLowerCase();
  const result = document.getElementById('dietResult');

  if (!goal) {
    result.innerHTML = "⚠️ Please enter a goal.";
    return;
  }

  const plans = {
    "weight loss": "🥗 Try a calorie deficit: more veggies, lean proteins, and water. Avoid sugary drinks.",
    "muscle gain": "🍗 Focus on protein-rich meals (eggs, chicken, tofu) and resistance training.",
    "energy": "🍌 Eat complex carbs (oats, banana, brown rice) and stay hydrated.",
    "focus": "🧠 Add nuts, dark chocolate, and omega-rich foods like salmon or chia seeds.",
  };

  result.innerHTML = plans[goal] || "🌿 Try a balanced diet: whole grains, fruits, and protein every day.";
}
function findHospital() {
  const result = document.getElementById('hospitalResult');
  result.innerHTML = "📍 Getting your location...";
  
  if (!navigator.geolocation) {
    result.innerHTML = "❌ Geolocation not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const mapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`;
      result.innerHTML = `✅ <a href="${mapsUrl}" target="_blank">Open Nearest Hospitals in Google Maps</a>`;
    },
    () => {
      result.innerHTML = "⚠️ Unable to access location. Please enable GPS.";
    }
  );
}
