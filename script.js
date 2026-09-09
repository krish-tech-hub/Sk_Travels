/* =========================================================
   SK TRAVELS
   PROFESSIONAL TRAVEL WEBSITE
   ========================================================= */

/* =========================================================
   BUSINESS DETAILS
========================================================= */

const WHATSAPP_NUMBER = "918300242430";

const VEHICLE_NAME = "Maruti Suzuki Dzire";

const VEHICLE_DETAILS = "5 Seater • AC • Sedan";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =================================================
           ELEMENTS
        ================================================= */

  const form = document.getElementById("bookingForm");

  const pickupDate = document.getElementById("pickupDate");

  const returnDate = document.getElementById("returnDate");

  const navbar = document.getElementById("mainNavbar");

  const scrollTop = document.getElementById("scrollTop");

  /* =================================================
           GET TODAY
        ================================================= */

  function getToday() {
    const today = new Date();

    const localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    );

    return localToday.toISOString().split("T")[0];
  }

  /* =================================================
           DATE SETTINGS
        ================================================= */

  if (pickupDate) {
    pickupDate.min = getToday();
  }

  if (returnDate) {
    returnDate.min = getToday();
  }

  /* =================================================
           PICKUP DATE CHANGE
        ================================================= */

  if (pickupDate && returnDate) {
    pickupDate.addEventListener("change", function () {
      if (!pickupDate.value) {
        returnDate.min = getToday();

        return;
      }

      returnDate.min = pickupDate.value;

      if (returnDate.value && returnDate.value < pickupDate.value) {
        returnDate.value = "";
      }
    });
  }

  /* =================================================
           FORMAT DATE
        ================================================= */

  function formatDate(value) {
    if (!value) {
      return "Not provided";
    }

    const dateObject = new Date(value + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /* =================================================
           FORMAT TIME
        ================================================= */

  function formatTime(value) {
    if (!value) {
      return "Not provided";
    }

    const parts = value.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    const dateObject = new Date();

    dateObject.setHours(hours, minutes, 0, 0);

    return dateObject.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  /* =================================================
           GET FORM VALUE
        ================================================= */

  function getValue(id) {
    const element = document.getElementById(id);

    if (!element) {
      return "";
    }

    return element.value.trim();
  }

  /* =================================================
           TRIP SUMMARY
        ================================================= */

  function updateTripSummary() {
    const summary = document.getElementById("tripSummary");

    if (!summary) {
      return;
    }

    const name = getValue("fullName");

    const phone = getValue("phone");

    const pickup = getValue("pickup");

    const drop = getValue("drop");

    const tripType = document.getElementById("tripType")?.value || "";

    const date = document.getElementById("pickupDate")?.value || "";

    const time = document.getElementById("pickupTime")?.value || "";

    const passengers = document.getElementById("passengers")?.value || "";

    /* ---------------------------------------------
               SUMMARY VALUES
            --------------------------------------------- */

    const summaryName = document.getElementById("summaryName");

    const summaryPhone = document.getElementById("summaryPhone");

    const summaryPickup = document.getElementById("summaryPickup");

    const summaryDrop = document.getElementById("summaryDrop");

    const summaryDate = document.getElementById("summaryDate");

    const summaryTime = document.getElementById("summaryTime");

    const summaryTrip = document.getElementById("summaryTrip");

    const summaryPassengers = document.getElementById("summaryPassengers");

    /* ---------------------------------------------
               UPDATE
            --------------------------------------------- */

    if (summaryName) {
      summaryName.textContent = name || "-";
    }

    if (summaryPhone) {
      summaryPhone.textContent = phone || "-";
    }

    if (summaryPickup) {
      summaryPickup.textContent = pickup || "-";
    }

    if (summaryDrop) {
      summaryDrop.textContent = drop || "-";
    }

    if (summaryDate) {
      summaryDate.textContent = date ? formatDate(date) : "-";
    }

    if (summaryTime) {
      summaryTime.textContent = time ? formatTime(time) : "-";
    }

    if (summaryTrip) {
      summaryTrip.textContent = tripType || "-";
    }

    if (summaryPassengers) {
      summaryPassengers.textContent = passengers || "-";
    }

    /* ---------------------------------------------
               SHOW SUMMARY
            --------------------------------------------- */

    const hasData =
      name || phone || pickup || drop || tripType || date || time || passengers;

    if (hasData) {
      summary.classList.add("show");
    } else {
      summary.classList.remove("show");
    }
  }

  /* =================================================
           LIVE SUMMARY
        ================================================= */

  if (form) {
    form.addEventListener("input", updateTripSummary);

    form.addEventListener("change", updateTripSummary);
  }

  /* =================================================
           PHONE INPUT
        ================================================= */

  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);

      updateTripSummary();
    });
  }

  /* =================================================
           BOOKING FORM
        ================================================= */

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      /* =====================================
                       GET VALUES
                    ===================================== */

      const name = getValue("fullName");

      const phone = getValue("phone");

      const pickup = getValue("pickup");

      const drop = getValue("drop");

      const tripType = document.getElementById("tripType")?.value || "";

      const date = document.getElementById("pickupDate")?.value || "";

      const time = document.getElementById("pickupTime")?.value || "";

      const returnTripDate = document.getElementById("returnDate")?.value || "";

      const passengers = document.getElementById("passengers")?.value || "";

      const notes = getValue("notes") || "None";

      /* =====================================
                       REQUIRED VALIDATION
                    ===================================== */

      if (
        !name ||
        !phone ||
        !pickup ||
        !drop ||
        !tripType ||
        !date ||
        !time ||
        !passengers
      ) {
        alert("Please fill all required fields.");

        return;
      }

      /* =====================================
                       PHONE VALIDATION
                    ===================================== */

      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");

        return;
      }

      /* =====================================
                       DATE VALIDATION
                    ===================================== */

      if (returnTripDate && returnTripDate < date) {
        alert("Return date cannot be earlier than the travel date.");

        return;
      }

      /* =====================================
                       WHATSAPP MESSAGE
                    ===================================== */

      const message = `🚗 *SK TRAVELS*
━━━━━━━━━━━━━━━━━━━━

📋 *NEW TRIP ENQUIRY*

👤 *CUSTOMER DETAILS*

Name: ${name}

Mobile: ${phone}


🗺️ *JOURNEY DETAILS*

Pickup: ${pickup}

Destination: ${drop}

Travel Date: ${formatDate(date)}

Pickup Time: ${formatTime(time)}

Return Date: ${returnTripDate ? formatDate(returnTripDate) : "Not provided"}


👥 *PASSENGERS*

Passengers: ${passengers}


🚘 *VEHICLE*

${VEHICLE_NAME}

${VEHICLE_DETAILS}


🔄 *TRIP TYPE*

${tripType}


📝 *ADDITIONAL REQUIREMENTS*

${notes}


━━━━━━━━━━━━━━━━━━━━

Please confirm availability
and share the trip quotation.

Thank you for choosing
*SK TRAVELS* 🚗`;

      /* =====================================
                       WHATSAPP URL
                    ===================================== */

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

      /* =====================================
                       OPEN WHATSAPP
                    ===================================== */

      const whatsappWindow = window.open(whatsappURL, "_blank");

      /* =====================================
                       RESET ONLY IF OPENED
                    ===================================== */

      if (whatsappWindow) {
        /* ---------------------------------
                           RESET FORM
                        --------------------------------- */

        form.reset();

        /* ---------------------------------
                           RESET DATE LIMITS
                        --------------------------------- */

        if (pickupDate) {
          pickupDate.min = getToday();
        }

        if (returnDate) {
          returnDate.min = getToday();
        }

        /* ---------------------------------
                           HIDE SUMMARY
                        --------------------------------- */

        const summary = document.getElementById("tripSummary");

        if (summary) {
          summary.classList.remove("show");
        }

        /* ---------------------------------
                           RESET SUMMARY
                        --------------------------------- */

        const summaryFields = [
          "summaryName",

          "summaryPhone",

          "summaryPickup",

          "summaryDrop",

          "summaryDate",

          "summaryTime",

          "summaryTrip",

          "summaryPassengers",
        ];

        summaryFields.forEach(function (id) {
          const element = document.getElementById(id);

          if (element) {
            element.textContent = "-";
          }
        });

        /* ---------------------------------
                           SUCCESS MESSAGE
                        --------------------------------- */

        showSuccessMessage();
      } else {
        /* ---------------------------------
                           POPUP BLOCKED
                        --------------------------------- */

        alert(
          "WhatsApp could not be opened. Please allow pop-ups and try again.",
        );
      }
    });
  }

  /* =================================================
           SUCCESS MESSAGE
        ================================================= */

  function showSuccessMessage() {
    const oldMessage = document.querySelector(".booking-success");

    if (oldMessage) {
      oldMessage.remove();
    }

    const success = document.createElement("div");

    success.className = "booking-success";

    success.innerHTML = `

                <i class="bi bi-check-circle-fill"></i>

                <div>

                    <strong>
                        Enquiry Prepared Successfully
                    </strong>

                    <small>
                        Your trip details are ready in WhatsApp.
                        Please press Send.
                    </small>

                </div>

            `;

    if (form) {
      form.prepend(success);
    }

    setTimeout(function () {
      if (!success) {
        return;
      }

      success.style.opacity = "0";

      success.style.transform = "translateY(-10px)";

      setTimeout(function () {
        if (success.parentNode) {
          success.remove();
        }
      }, 400);
    }, 5000);
  }

  /* =================================================
           NAVBAR SCROLL
        ================================================= */

  function handleNavbarScroll() {
    if (!navbar) {
      return;
    }

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);

  handleNavbarScroll();

  /* =================================================
           MOBILE NAVBAR CLOSE
        ================================================= */

  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      const menu = document.getElementById("mainMenu");

      if (menu && menu.classList.contains("show")) {
        const collapse = bootstrap.Collapse.getOrCreateInstance(menu);

        collapse.hide();
      }
    });
  });

  /* =================================================
           ACTIVE NAVIGATION
        ================================================= */

  const sections = document.querySelectorAll("section[id]");

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function updateActiveNavigation() {
    let currentSection = "home";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 180;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavigation);

  updateActiveNavigation();

  /* =================================================
           SMOOTH SCROLL
        ================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,

        behavior: "smooth",
      });
    });
  });

  /* =================================================
           SCROLL REVEAL
        ================================================= */

  const revealElements = document.querySelectorAll(
    ".feature, " +
      ".fleet-card, " +
      ".destination-card, " +
      ".service-card, " +
      ".gallery-item, " +
      ".contact-card, " +
      ".about-image, " +
      ".booking-card, " +
      ".faq-accordion",
  );

  revealElements.forEach(function (element) {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("active");
    });
  }

  /* =================================================
           SCROLL TO TOP
        ================================================= */

  if (scrollTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        scrollTop.classList.add("show");
      } else {
        scrollTop.classList.remove("show");
      }
    });

    scrollTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,

        behavior: "smooth",
      });
    });
  }

  /* =================================================
           PREVENT OLD FORM DATA ON PAGE LOAD
        ================================================= */

  if (form) {
    updateTripSummary();
  }
});
