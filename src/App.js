import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const textRefs = useRef([]);
  const weddingDate = useMemo(() => new Date("2025-09-29T17:00:00"), []);
  const [eventStartTime, setEventStartTime] = useState("17:00"); 

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const scrollToSection = (index) => {
      if (index < sections.length) {
        sections[index].scrollIntoView({ behavior: "smooth" });
        if (index < sections.length - 1) {
          setTimeout(() => scrollToSection(index + 1), 5000);
        }
      }
    };
    const scrollTimer = setTimeout(() => scrollToSection(0), 1000);
    return () => clearTimeout(scrollTimer);
  }, []);

  const getTimeLeft = useCallback(() => {
    const now = new Date();
    const [hours, minutes] = eventStartTime.split(':');
    const eventDateTime = new Date(weddingDate);
    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diff = eventDateTime - now;
    if (diff <= 0) return {};
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [weddingDate, eventStartTime]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [getTimeLeft]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('text-visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let confetti = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    class Confetti {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.color = ['#ff9999', '#99ccff', '#ccffcc', '#ffcc99'][Math.floor(Math.random() * 4)];
      }

      update() {
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height + 50) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    for (let i = 0; i < 50; i++) {
      confetti.push(new Confetti());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#fff0f5');
      gradient.addColorStop(1, '#e6f3ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      confetti.forEach(piece => {
        piece.update();
        piece.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  const handleTimeChange = (e) => {
    setEventStartTime(e.target.value);
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="background-canvas"></canvas>

      {/* Welcome Section - Centered Layout */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-content">
            <h1 ref={addToRefs} className="main-title animated-text">
              🎉 Welcome to My 1st Birthday! 🎉
            </h1>
            <div className="intro-grid">
              <div className="intro-text">
                <p ref={addToRefs} className="subtitle animated-text highlight-text">
                  I'm <strong className="name-highlight">LIYA RACHEL</strong> 💖
                </p>
                <p ref={addToRefs} className="description animated-text-left">
                  Beloved Daughter of <strong>Gowtham Rebekal</strong> & <strong>G. Liya Rachel</strong>
                </p>
              </div>
              <div className="photo-display">
                <div className="photo-wrapper">
                  <img
                    src="images/WhatsApp Image 2025-09-22 at 13.02.32_93b51003.jpg"
                    alt="Family"
                    className="family-photo"
                  />
                  <div className="photo-border"></div>
                </div>
                <p ref={addToRefs} className="photo-caption animated-text">
                  💞 Our Beautiful Family 💞
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section - Card Layout */}
      <section className="countdown-section">
        <div className="container">
          <div className="section-header centered">
            <h2 ref={addToRefs} className="section-title animated-text">
              ⏳ Countdown to Our Big Day
            </h2>
          </div>
          <div className="countdown-display">
            {timeLeft.days !== undefined ? (
              <div className="countdown-cards">
                <div className="countdown-card">
                  <div className="card-number">{timeLeft.days}</div>
                  <div className="card-label">Days</div>
                </div>
                <div className="countdown-card">
                  <div className="card-number">{timeLeft.hours}</div>
                  <div className="card-label">Hours</div>
                </div>
                <div className="countdown-card">
                  <div className="card-number">{timeLeft.minutes}</div>
                  <div className="card-label">Minutes</div>
                </div>
                <div className="countdown-card">
                  <div className="card-number">{timeLeft.seconds}</div>
                  <div className="card-label">Seconds</div>
                </div>
              </div>
            ) : (
              <div className="celebration-message">
                <p className="celebration-text">🎉 It's Our Celebration Day! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section - Grid Layout */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header left-aligned">
            <h2 ref={addToRefs} className="section-title animated-text">
              📸 Precious Memories
            </h2>
          </div>
          <div className="gallery-container">
            <div className="gallery-grid">
              {[
                "WhatsApp Image 2025-09-23 at 16.30.03_b26879a7.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.28_ac49efe3.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.28_c69e374c.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.29_0c1f4828.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.29_8a42a2ee.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.30_693ff621.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.30_747ae9f6.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.31_1fd26f5c.jpg",
                "WhatsApp Image 2025-09-22 at 13.02.31_fc018450.jpg",
                "WhatsApp Image 2025-09-23 at 16.30.04_c498f190.jpg",
              ].map((file, index) => (
                <div 
                  key={index} 
                  className="gallery-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="gallery-card">
                    <img
                      src={`/images/${file}`}
                      alt={`Memory ${index + 1}`}
                      className="gallery-image"
                    />
                    <div className="card-overlay">
                      <span className="memory-number">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section - Side by Side Layout */}
      <section className="venue-section">
        <div className="container">
          <div className="section-header centered">
            <h2 ref={addToRefs} className="section-title animated-text">
              📍 Venue Details
            </h2>
          </div>
          <div className="venue-layout">
            <div className="venue-info">
              <div className="venue-card">
                <div className="venue-icon">🏛️</div>
                <div className="venue-content">
                  <h3>Priya Dharshini Mini Hall</h3>
                  <p className="venue-address">Chennai, Tamil Nadu, India</p>
                  <p className="event-time-display">
                    ⏰ Event Time: {eventStartTime} on September 29, 2025
                  </p>
                  <button
                    className="direction-btn"
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/place/PRIYA+DHARSHINI+MINI+HALL/@13.0391946,80.2166729,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5267530e4768e7:0x83311a01c02888a9!8m2!3d13.0391946!4d80.2166729!16s%2Fg%2F11qpsbc_ph?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
                        "_blank"
                      )
                    }
                  >
                    📍 Get Directions
                  </button>
                </div>
              </div>
            </div>
            <div className="map-display">
              <div className="map-wrapper">
                <iframe
                  title="Venue Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.961578285572!2d80.2166729!3d13.0391946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267530e4768e7%3A0x83311a01c02888a9!2sPRIYA%20DHARSHINI%20MINI%20HALL!5e0!3m2!1sen!2sin!4v1694192491746!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section - Centered Layout */}
      <section className="closing-section">
        <div className="container">
          <div className="closing-content">
            <h2 ref={addToRefs} className="closing-title animated-text">
              We Can't Wait to Celebrate With You! 💖
            </h2>
            <div className="signature">
              <p ref={addToRefs} className="closing-text animated-text">
                With all our love,
              </p>
              <div className="names">
                <span className="name">Gowtham Rebekal</span>
                <span className="ampersand">&</span>
                <span className="name">G. Liya Rachel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <p className="footer-text">
              For inquiries or to create a website like this, contact:
            </p>
            <p className="footer-contact">
              📞 <a href="tel:+917010145439">+91 7010145439</a>
            </p>
            <p className="footer-contact">
              📸 Instagram: <a href="https://www.instagram.com/saran_tech_studio" target="_blank" rel="noopener noreferrer">saran_tech_studio</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;