import React, { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const sectionsRef = useRef([]);
  const bgVideoRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"),
    ]).then(() => {
      const anime = window.anime;

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime({
                targets: entry.target.querySelector(".content-container"),
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1000,
                easing: "easeOutExpo",
              });
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      sectionsRef.current.forEach((section) => {
        if (section) observer.observe(section);
      });
    });
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");

    cards.forEach((card) => {
      const specular = card.querySelector(".glass-specular");

      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (specular) {
          specular.style.background = `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.05) 10%,
            rgba(255,255,255,0) 20%
          )`;
        }
      };

      const handleLeave = () => {
        if (specular) {
          specular.style.background = "none";
        }
      };

      const handleclick = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!specular) return;

        let progress = 0;   // from 0 to 1
        const duration = 700; // animation duration in ms
        const startTime = performance.now();

        function animate(time) {
          progress = (time - startTime) / duration;
          if (progress > 1) progress = 1;

          // Calculate gradient radius in % (start small, grow bigger)
          // Let's say radius grows from 10% to 100%
          const radius1 = 1 + 99 * progress;  // inner stop
          const radius2 = radius1 + 10;        // second stop a bit further

          // Calculate opacity fading out from 0.2 to 0
          const opacity = 0.2 * (1 - progress);

          specular.style.background = `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255,255,255,${opacity}) 0%,
            rgba(255,255,255,${opacity * 0.25}) ${radius1}%,
            rgba(255,255,255,0) ${radius2}%
          )`;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Clear background after animation ends
            specular.style.background = "";
          }
        }

        requestAnimationFrame(animate);
      };


      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
      card.addEventListener("click", handleclick);

      return () => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  useEffect(() => {
    const nav = document.querySelector('.sticky-nav');
    const menuToggle = document.querySelector('.sticky-nav-toggle');
    const menu = document.querySelector('.sticky-nav-menu');
    const navLinks = document.querySelectorAll('.sticky-nav-menu a');
    const sections = document.querySelectorAll('section');

    // Handle nav background shadow on scroll
    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Scroll spy active link update
      let currentSectionId = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 80; // adjust offset to nav height
        if (window.scrollY >= sectionTop) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    };

    // Toggle mobile menu open/close
    const toggleMenu = () => {
      menu.classList.toggle('mobile-active');
      const icon = menuToggle.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    };

    // Close mobile menu on link click (scroll spy updates active link)
    const onNavLinkClick = () => {
      if (window.innerWidth <= 768) {
        menu.classList.remove('mobile-active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    };

    window.addEventListener('scroll', onScroll);
    menuToggle?.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
      link.addEventListener('click', onNavLinkClick);
    });

    // Reset mobile menu if window resized above breakpoint
    const onResize = () => {
      if (window.innerWidth > 768) {
        menu.classList.remove('mobile-active');
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-times')) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    };
    window.addEventListener('resize', onResize);

    // Set initial state
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      menuToggle?.removeEventListener('click', toggleMenu);
      navLinks.forEach(link => {
        link.removeEventListener('click', onNavLinkClick);
      });
      window.removeEventListener('resize', onResize);
    };
  }, []);



  const sections = [
    {
      id: "intro",
      title: "Jaynil Patel",
      content: "Aspiring Aerospace Engineer | IB HighSchool Student | Tech Enthusiast",
      hasButton: false,
    },
    {
      id: "about",  // new id
      title: "About Me",
      content: `I am passionate about aerospace engineering, technology, and coding. 
        I enjoy building projects that combine software and hardware, such as facial recognition and rocket simulation. 
        Currently, I am an IB high school student focused on STEM and innovation.`,
      link: "https://gmail.com",
      hasButton: true,
      buttonText: "Learn More",
    },
    {
      id: "projects",
      title: "Projects",
      content: "Facial recognition software, gesture-controlled media controller, and a rocket apogee simulator.",
      link: "https://example.com",
      hasButton: true,
      buttonText: "Learn More",
    },
    {
      id: "contact",
      title: "Contact Me",
      content: [
        {
          label: "Email",
          value: "Jaynil.patel.canada@gmail.com",
          link: "mailto:Jaynil.patel.canada@gmail.com"
        },
        {
          label: "GitHub",
          value: "@Jaynil-P09",
          link: "https://github.com/Jaynil-P09"
        },
                {
          label: "Instagram",
          value: "@jaynil_p09",
          link: "https://www.instagram.com/jaynil_p09/"
        }
      ],
      hasButton: true,
      buttonText: "Linktree",
      link: "https://linktr.ee/Jaynil_P09"
    }
  ];


  return (
    <>
      <video
        id="bg-video"
        ref={bgVideoRef}
        autoPlay
        muted
        loop
        playsInline
        src="blackhole.mp4"
      />

      <nav className="sticky-nav">
        <div className="sticky-nav-logo">
          <img
            src="\logo.png"
            alt="Logo"
            style={{ width: "80px", height: "80px", objectFit: "cover", alignContent: "center"}}
          />
          <a href="#intro" className="active">Jaynil Patel</a>
        </div>

        <button className="sticky-nav-toggle" aria-label="Toggle menu">
          <i className="fas fa-bars"></i>
        </button>

        <ul className="sticky-nav-menu">
          <li><a href="#about" className="active">About Me</a></li>
          <li><a href="#projects">My Projects</a></li>
          <li><a href="#contact">Contact Me</a></li>
        </ul>
      </nav>


      {sections.map(({ id, title, content, link, hasButton, buttonText }, i) => (
        <section
          key={id}
          id={id}
          className="anime-section"
          ref={(el) => (sectionsRef.current[i] = el)}
        >
          <div className="section-inner auto-size">
            <div className="glass-card">
              <div className="glass-filter" />
              <div className="glass-distortion-overlay" />
              <div className="glass-overlay" />
              <div className="glass-specular" />
            </div>
            <div className="content-container">
              <h2>{title}</h2>
              {Array.isArray(content) ? (
                <div>
                  {content.map((item, index) => (
                    <p key={index}>
                      <strong>{item.label}:</strong>{" "}
                      <a
                        href={item.link}
                        style={{color: "inherit", textDecoration: "none"}}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    </p>
                  ))}
                </div>
              ) : (
                <p>{content}</p>
              )}

              {hasButton && link && buttonText && (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <button className="glass-button">{buttonText}</button>
                </a>
              )}
            </div>

          </div>
        </section>
      ))}
    </>
  );
}

export default App;








