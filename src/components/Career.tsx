import "./styles/Career.css";

const Career = () => {
  return (
      <div className="career-section section-container">
        <div className="career-container">
          <h2>
            My career <span>&</span>
            <br /> experience
          </h2>
          <div className="career-info">
            <div className="career-timeline">
              <div className="career-dot"></div>
            </div>
            <div className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>Giffan</h4>
                  <h5>Media - partime</h5>
                </div>
                <h3>2024 - 2025</h3>
              </div>
              <p>
                Worked on media content for social platforms, supporting both production and
                post-production tasks. My role included shooting assistance, video editing,
                and creating visual content that matched the brand's style and day-to-day
                communication needs.
              </p>
            </div>
            <div className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>Lamfao</h4>
                  <h5>Video Editor - Freelance</h5>
                </div>
                <h3>2025</h3>
              </div>
              <p>
                Worked as a freelance video editor for a football-focused YouTube channel,
                editing content built around match coverage, commentary, and fan-driven storytelling.
                My role focused on shaping footage into engaging videos with clear pacing,
                strong structure, and a style that fit the channel's audience.
              </p>
            </div>
            <div className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>AU Solutions</h4>
                  <h5>Media Executive</h5>
                </div>
                <h3>Now</h3>
              </div>
              <p>
                Currently managing media-related tasks across content development, production,
                and post-production. I contribute to social content and branded projects with
                a focus on strong visuals, clear messaging, and smooth execution.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Career;
