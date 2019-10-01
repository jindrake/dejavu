import React from 'react'

const LandingPage = () => (
  <>
    {/* <div id="preloader">
      <div id="loader" className="dots-jump">
          <div></div>
          <div></div>
          <div></div>
      </div>
    </div> */}

    <div className='s-header'>
      <div className='row'>
        <div className='header-logo'>
          <a className='site-logo' href='/landing-page'>
            <img src='images/logo.svg' alt='Homepage' />
          </a>
        </div>

        <nav className='header-nav-wrap'>
          <ul className='header-main-nav'>
            <li className='current'><a className='smoothscroll' href='#home' title='intro'>Intro</a></li>
            <li><a className='smoothscroll' href='#about' title='about'>About</a></li>
            <li><a className='smoothscroll' href='#features' title='features'>Features</a></li>
            <li><a className='smoothscroll' href='#pricing' title='pricing'>Pricing</a></li>
            <li><a className='smoothscroll' href='#download' title='download'>Download</a></li>
          </ul>

          <div className='header-cta'>
            <a href='#download' className='btn btn--primary header-cta__btn smoothscroll'>Get The App</a>
          </div>
        </nav>

        <a className='header-menu-toggle' href='#'><span>Menu</span></a>
      </div>
    </div>

    <section id='home' className='s-home target-section' data-parallax='scroll' data-image-src='images/hero-bg.jpg' data-natural-width='3000' data-natural-height='2000' data-position-y='center'>

      <div className='shadow-overlay' />

      <div className='home-content'>

        <div className='row home-content__main'>

          <div className='home-content__left'>
            <h1>
                    An Amazing App <br />
                    That Does It All.
            </h1>

            <h3>
                    Voluptatem ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explica. Nemo enim ipsam voluptatem quia.
                    Ut quis enim.
            </h3>

            <div className='home-content__btn-wrap'>
              <a href='#download' className='btn btn--primary home-content__btn smoothscroll'>
                            Get The App
              </a>
            </div>
          </div>

          <div className='home-content__right'>
            <img src='images/hero-app-screens-800.png' srcSet='images/hero-app-screens-800.png 1x, images/hero-app-screens-1600.png 2x' />
          </div>

        </div>

        <ul className='home-content__social'>
          <li><a href='#0'>Facebook</a></li>
          <li><a href='#0'>twitter</a></li>
          <li><a href='#0'>Instagram</a></li>
        </ul>

      </div>

      <a href='#about' className='home-scroll smoothscroll'>
        <span className='home-scroll__text'>Scroll</span>
        <span className='home-scroll__icon' />
      </a>

    </section>

    <section id='about' className='s-about target-section'>

      <div className='row section-header has-bottom-sep' data-aos='fade-up'>
        <div className='col-full'>
          <h1 className='display-1'>
                    Simply The Best Messaging App Out There.
          </h1>
          <p className='lead'>
                    Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                    Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                    omnis ea.
          </p>
        </div>
      </div>

      <div className='row wide about-desc' data-aos='fade-up'>

        <div className='col-full slick-slider about-desc__slider'>

          <div className='about-desc__slide'>
            <h3 className='item-title'>Intuitive.</h3>

            <p>
                    Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                    Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                    omnis ea aut cumque eos.
            </p>
          </div>

          <div className='about-desc__slide'>
            <h3 className='item-title'>Smart.</h3>

            <p>
                    Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                    Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                    omnis ea aut cumque eos.
            </p>
          </div>

          <div className='about-desc__slide'>
            <h3 className='item-title'>Powerful.</h3>

            <p>
                    Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                    Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                    omnis ea aut cumque eos.
            </p>
          </div>

          <div className='about-desc__slide'>
            <h3 className='item-title'>Secure.</h3>

            <p>
                    Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                    Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                    omnis ea aut cumque eos.
            </p>
          </div>

        </div>

      </div>

    </section>

    <section id='about-how' className='s-about-how'>
      <div className='row'>
        <div className='col-full video-bg' data-aos='fade-up'>

          <div className='shadow-overlay' />

          <a className='btn-video' href='https://player.vimeo.com/video/14592941?color=00a650&title=0&byline=0&portrait=0' data-lity>
            <span className='video-icon' />
          </a>

          <div className='stats'>
            <div className='item-stats'>
              <span className='item-stats__num'>
                        3.1M
              </span>
              <span className='item-stats__title'>
                        Downloads
              </span>
            </div>
            <div className='item-stats'>
              <span className='item-stats__num'>
                        24K
              </span>
              <span className='item-stats__title'>
                        Positive Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='row process-wrap'>

        <h2 className='display-2 text-center' data-aos='fade-up'>How The App Works?</h2>

        <div className='process' data-aos='fade-up'>
          <div className='process__steps block-1-2 block-tab-full group'>

            <div className='col-block step'>
              <h3 className='item-title'>Sign-Up</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            <div className='col-block step'>
              <h3 className='item-title'>Create</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            <div className='col-block step'>
              <h3 className='item-title'>Compose</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            <div className='col-block step'>
              <h3 className='item-title'>Send</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <section id='features' className='s-features target-section'>
      <div className='row section-header has-bottom-sep' data-aos='fade-up'>
        <div className='col-full'>
          <h1 className='display-1'>
                Loaded With Features You Would Absolutely Love.
          </h1>
          <p className='lead'>
                Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                Ut quis enim rerum quia assumenda repudiandae molestiae cumque qui. Amet repellat
                omnis ea.
          </p>
        </div>
      </div>

      <div className='row features block-1-3 block-m-1-2'>
        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-upload' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Cloud Based</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>

        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-video-camera' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Voice & Video</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>

        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-shield' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Always Secure</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>

        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-lego-block' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Play Games</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>

        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-chat' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Group Chat</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>

        <div className='col-block item-feature' data-aos='fade-up'>
          <div className='item-feature__icon'>
            <i className='icon-wallet' />
          </div>
          <div className='item-feature__text'>
            <h3 className='item-title'>Payments</h3>
            <p>Nemo cupiditate ab quibusdam quaerat impedit magni. Earum suscipit ipsum laudantium.
                Quo delectus est. Maiores voluptas ab sit natus veritatis ut. Debitis nulla cumque veritatis.
                Sunt suscipit voluptas ipsa in tempora esse soluta sint.
            </p>
          </div>
        </div>
      </div>

      <div className='testimonials-wrap' data-aos='fade-up'>
        <div className='row'>
          <div className='col-full testimonials-header'>
            <h2 className='display-2'>Our Users Love Our App!</h2>
          </div>
        </div>

        <div className='row testimonials'>
          <div className='col-full slick-slider testimonials__slider'>
            <div className='testimonials__slide'>
              <img src='images/avatars/user-03.jpg' alt='Author image' className='testimonials__avatar' />

              <p>Qui ipsam temporibus quisquam velMaiores eos cumque distinctio nam accusantium ipsum.
                Laudantium quia consequatur molestias delectus culpa facere hic dolores aperiam. Accusantium praesentium corpori.</p>

              <div className='testimonials__author'>
                <span className='testimonials__name'>Naruto Uzumaki</span>
                <a href='#0' className='testimonials__link'>@narutouzumaki</a>
              </div>
            </div>

            <div className='testimonials__slide'>
              <img src='images/avatars/user-05.jpg' alt='Author image' className='testimonials__avatar' />

              <p>Excepturi nam cupiditate culpa doloremque deleniti repellat. Veniam quos repellat voluptas animi adipisci.
                Nisi eaque consequatur. Quasi voluptas eius distinctio. Atque eos maxime. Qui ipsam temporibus quisquam vel.</p>

              <div className='testimonials__author'>
                <span className='testimonials__name'>Sasuke Uchiha</span>
                <a href='#0' className='testimonials__link'>@sasukeuchiha</a>
              </div>
            </div>

            <div className='testimonials__slide'>
              <img src='images/avatars/user-01.jpg' alt='Author image' className='testimonials__avatar' />

              <p>Repellat dignissimos libero. Qui sed at corrupti expedita voluptas odit. Nihil ea quia nesciunt. Ducimus aut sed ipsam.
                Autem eaque officia cum exercitationem sunt voluptatum accusamus. Quasi voluptas eius distinctio.</p>

              <div className='testimonials__author'>
                <span className='testimonials__name'>Shikamaru Nara</span>
                <a href='#0' className='testimonials__link'>@shikamarunara</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id='pricing' className='s-pricing target-section'>
      <div className='row section-header align-center' data-aos='fade-up'>
        <div className='col-full'>
          <h1 className='display-1'>
                Our Simple <br /> Straight-Forward Pricing.
          </h1>
          <p className='lead'>
                Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                omnis ea.
          </p>
        </div>
      </div>

      <div className='row plans block-1-2 block-m-1-2 block-tab-full stack'>
        <div className='col-block item-plan' data-aos='fade-up'>
          <div className='item-plan__block'>

            <div className='item-plan__top-part'>
              <h3 className='item-plan__title'>Free</h3>
              <p className='item-plan__price'>$0</p>
              <p className='item-plan__per'>Forever</p>
            </div>

            <div className='item-plan__bottom-part'>
              <ul className='item-plan__features'>
                <li><span>5GB</span> Storage</li>
                <li><span>10GB</span> Bandwidth</li>
                <li><span>30</span> Email Accounts</li>
                <li>Backup & Restore</li>
              </ul>

              <a className='btn btn--primary large full-width' href='#0'>Get Started</a>
            </div>

          </div>
        </div>
      </div>

      <div className='col-block item-plan item-plan--popular' data-aos='fade-up'>
        <div className='item-plan__block'>

          <div className='item-plan__top-part'>
            <h3 className='item-plan__title'>Pro Plan</h3>
            <p className='item-plan__price'>$10</p>
            <p className='item-plan__per'>Per Month</p>
          </div>

          <div className='item-plan__bottom-part'>
            <ul className='item-plan__features'>
              <li><span>500GB</span> Storage</li>
              <li><span>Unlimited</span> Bandwidth</li>
              <li><span>50</span> Email Accounts</li>
              <li>Backup & Restore</li>
            </ul>

            <a className='btn btn--primary large full-width' href='#0'>Get Started</a>
          </div>

        </div>
      </div>
    </section>

    <section id='download' className='s-download target-section'>
      <div className='row section-header align-center' data-aos='fade-up'>
        <div className='col-full'>
          <h1 className='display-1'>
                Join Our Community of 3,000,000+ Users.
          </h1>
          <p className='lead'>
                Et nihil atque ex. Reiciendis et rerum ut voluptate. Omnis molestiae nemo est.
                Ut quis enim rerum quia assumenda repudiandae non cumque qui. Amet repellat
                omnis ea.
          </p>
        </div>
      </div>

      <div className='row'>
        <div className='col-full text-center'>
          <ul className='download-badges' data-aos='fade-up'>
            <li><a href='#0' title='' className='badge-appstore'>App Store</a></li>
            <li><a href='#0' title='' className='badge-googleplay'>Play Store</a></li>
          </ul>
        </div>
      </div>

      <div className='row download-bottom-image' data-aos='fade-up'>
        <img src='images/app-screen-1400.png'
          srcSet='images/app-screen-600.png 600w,
                      images/app-screen-1400.png 1400w,
                      images/app-screen-2800.png 2800w'
          sizes='(max-width: 2800px) 100vw, 2800px'
          alt='App Screenshots' />
      </div>
    </section>

    <footer className='s-footer footer'>
      <div className='row section-header align-center'>
        <div className='col-full'>
          <h1 className='display-1'>
                  Let's Stay In Touch.
          </h1>
          <p className='lead'>
              Subscribe for updates, special offers, and other amazing stuff.
          </p>
        </div>
      </div>

      <div className='row footer__top'>
        <div className='col-full footer__subscribe end'>
          <div className='subscribe-form'>
            <form id='mc-form' className='group' noValidate>

              {/* <input type="email" value="" name="EMAIL" className="email" id="mc-email" placeholder="Email Address" required="" />

                      <input type="submit" name="subscribe" value="Sign Up" /> */}

              <label htmlFor='mc-email' className='subscribe-message' />

            </form>
          </div>
        </div>
      </div>

      <div className='row footer__bottom'>
        <div className='footer__about col-five tab-full left'>
          <h4>About Kairos.</h4>

          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex consectetur adipisicing elit do eiusmod tempor.
          </p>

          <ul className='footer__social'>
            <li><a href='#0'><i className='fab fa-facebook-f' aria-hidden='true' /></a></li>
            <li><a href='#0'><i className='fab fa-twitter' aria-hidden='true' /></a></li>
            <li><a href='#0'><i className='fab fa-instagram' aria-hidden='true' /></a></li>
          </ul>
        </div>

        <div className='col-five md-seven tab-full right end'>
          <div className='row'>

            <div className='footer__site-links col-five mob-full'>
              <h4>Site links.</h4>

              <ul className='footer__site-links'>
                <li><a href='#home' className='smoothscroll'>Intro</a></li>
                <li><a href='#about' className='smoothscroll'>About</a></li>
                <li><a href='#features' className='smoothscroll'>Features</a></li>
                <li><a href='#pricing' className='smoothscroll'>Pricing</a></li>
                <li><a href='#download' className='smoothscroll'>Download</a></li>
                <li><a href='#0'>Privacy Policy</a></li>
              </ul>
            </div>

            <div className='footer__contact col-seven mob-full'>
              <h4>Contact Us.</h4>

              <p>
                  Phone: (+63) 555 1212 <br />
                  Fax: (+63) 555 0100
              </p>
              <p>
                  Need help or have a question? Contact us at: <br />
                <a href='mailto:#0' className='footer__mail-link'>support@kairos.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className='col-full ss-copyright'>
          <span>&copy; Copyright Kairos 2018</span>
          <span>Design by <a href='https://www.styleshout.com/'>styleshout</a></span>
        </div>
      </div>

      <div className='go-top'>
        <a className='smoothscroll' title='Back to Top' href='#top' />
      </div>
    </footer>
  </>
)

export default LandingPage
