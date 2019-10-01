import React from 'react'

const LandingPage = () => {
  return (
    <div className='App'>
      <header className='header_area'>
        <div className='main_menu' id='mainNav'>
          <nav className='navbar navbar-expand-lg navbar-light'>
            <div className='container'>
              <a className='navbar-brand logo_h' href='index.html'><img src='img/logo.png' alt='' /></a>
              <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='icon-bar' />
                <span className='icon-bar' />
                <span className='icon-bar' />
              </button>
              <div className='collapse navbar-collapse offset' id='navbarSupportedContent'>
                <ul className='nav navbar-nav menu_nav ml-auto'>
                  <li className='nav-item active'><a className='nav-link' href='#home'>Home</a></li>
                  <li className='nav-item'><a className='nav-link' href='#feature'>FEATURES</a></li>
                  <li className='nav-item'><a className='nav-link' href='#video'>VIDEO</a></li>
                  <li className='nav-item'><a className='nav-link' href='#price'>PRICING</a></li>
                  <li className='nav-item'><a className='nav-link' href='#screen'>SCREENS</a></li>
                  <li className='nav-item submenu dropdown'>
                    <a href='#' className='nav-link dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Pages</a>
                    <ul className='dropdown-menu'>
                      <li className='nav-item'><a className='nav-link' href='elements.html'>Elements</a></li>
                    </ul>
                  </li>
                  <li className='nav-item submenu dropdown'>
                    <a href='#' className='nav-link dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Blog</a>
                    <ul className='dropdown-menu'>
                      <li className='nav-item'><a className='nav-link' href='blog.html'>Blog</a></li>
                      <li className='nav-item'><a className='nav-link' href='single-blog.html'>Blog Details</a></li>
                    </ul>
                  </li>
                  <li className='nav-item'><a className='nav-link' href='contact.html'>Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <section className='home_banner_area' id='home'>
        <div className='banner_inner'>
          <div className='container'>
            <div className='row banner_content'>
              <div className='col-lg-9'>
                <h2>The Best App <br />in the Universe</h2>
                <p>inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that, as women.</p>
                <a className='banner_btn' href='#'>Explore Now</a>
              </div>
              <div className='col-lg-3'>
                <div className='banner_map_img'>
                  <img className='img-fluid' src='img/banner/right-mobile.png' alt='' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='feature_area p_120' id='feature'>
        <div className='container'>
          <div className='main_title'>
            <h2>Unique Features</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore  et dolore magna aliqua.</p>
          </div>
          <div className='feature_inner row'>
            <div className='col-lg-3 col-md-6'>
              <div className='feature_item'>
                <img src='img/icon/f-icon-1.png' alt='' />
                <h4>Maintenance</h4>
                <p>inappropriate behavior is often laughed off as boys will be boys,” women face higher conduct standards especially in the workplace. That’s why.</p>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='feature_item'>
                <img src='img/icon/f-icon-1.png' alt='' />
                <h4>Maintenance</h4>
                <p>inappropriate behavior is often laughed off as boys will be boys,” women face higher conduct standards especially in the workplace. That’s why.</p>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='feature_item'>
                <img src='img/icon/f-icon-1.png' alt='' />
                <h4>Maintenance</h4>
                <p>inappropriate behavior is often laughed off as boys will be boys,” women face higher conduct standards especially in the workplace. That’s why.</p>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='feature_item'>
                <img src='img/icon/f-icon-1.png' alt='' />
                <h4>Maintenance</h4>
                <p>inappropriate behavior is often laughed off as boys will be boys,” women face higher conduct standards especially in the workplace. That’s why.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='interior_area'>
        <div className='container'>
          <div className='interior_inner row'>
            <div className='col-lg-6'>
              <img className='img-fluid' src='img/interior-1.png' alt='' />
            </div>
            <div className='col-lg-5 offset-lg-1'>
              <div className='interior_text'>
                <h4>We Believe that Interior beautifies the Total Architecture</h4>
                <p>inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that, as women, our behavior on the job is beyond reproach. inappropriate behavior is often laughed off.</p>
                <a className='main_btn' href='#'>See Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='interior_area interior_two'>
        <div className='container'>
          <div className='interior_inner row'>
            <div className='col-lg-5 offset-lg-1'>
              <div className='interior_text'>
                <h4>We Believe that Interior beautifies the Total Architecture</h4>
                <p>inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that, as women, our behavior on the job is beyond reproach. inappropriate behavior is often laughed off.</p>
                <a className='main_btn' href='#'>See Details</a>
              </div>
            </div>
            <div className='col-lg-6'>
              <img className='img-fluid' src='img/interior-2.png' alt='' />
            </div>
          </div>
          <div className='video_area' id='video'>
            <img className='img-fluid' src='img/video-1.png' alt='' />
            <a className='popup-youtube' href='https://www.youtube.com/watch?v=VufDd-QL1c0'>
              <img src='img/icon/video-icon-1.png' alt='' />
            </a>
          </div>
        </div>
      </section>

      <section className='price_area p_120' id='price'>
        <div className='container'>
          <div className='main_title'>
            <h2>Pricing Table</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore  et dolore magna aliqua.</p>
          </div>
          <div className='price_item_inner row'>
            <div className='col-lg-4'>
              <div className='price_item'>
                <div className='price_head'>
                  <div className='float-left'>
                    <h3>Standard</h3>
                    <p>For the individuals</p>
                  </div>
                  <div className='float-right'>
                    <h2>£199</h2>
                  </div>
                </div>
                <div className='price_body'>
                  <ul className='list'>
                    <li><a href='#'>2.5 GB Free Photos</a></li>
                    <li><a href='#'>Secure Online Transfer Indeed</a></li>
                    <li><a href='#'>Unlimited Styles for interface</a></li>
                    <li><a href='#'>Reliable Customer Service</a></li>
                    <li><a href='#'>Manual Backup Provided</a></li>
                  </ul>
                </div>
                <div className='price_footer'>
                  <a className='main_btn2' href='#'>Purchase Plan</a>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='price_item'>
                <div className='price_head'>
                  <div className='float-left'>
                    <h3>Standard</h3>
                    <p>For the individuals</p>
                  </div>
                  <div className='float-right'>
                    <h2>£199</h2>
                  </div>
                </div>
                <div className='price_body'>
                  <ul className='list'>
                    <li><a href='#'>2.5 GB Free Photos</a></li>
                    <li><a href='#'>Secure Online Transfer Indeed</a></li>
                    <li><a href='#'>Unlimited Styles for interface</a></li>
                    <li><a href='#'>Reliable Customer Service</a></li>
                    <li><a href='#'>Manual Backup Provided</a></li>
                  </ul>
                </div>
                <div className='price_footer'>
                  <a className='main_btn2' href='#'>Purchase Plan</a>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='price_item'>
                <div className='price_head'>
                  <div className='float-left'>
                    <h3>Standard</h3>
                    <p>For the individuals</p>
                  </div>
                  <div className='float-right'>
                    <h2>£199</h2>
                  </div>
                </div>
                <div className='price_body'>
                  <ul className='list'>
                    <li><a href='#'>2.5 GB Free Photos</a></li>
                    <li><a href='#'>Secure Online Transfer Indeed</a></li>
                    <li><a href='#'>Unlimited Styles for interface</a></li>
                    <li><a href='#'>Reliable Customer Service</a></li>
                    <li><a href='#'>Manual Backup Provided</a></li>
                  </ul>
                </div>
                <div className='price_footer'>
                  <a className='main_btn2' href='#'>Purchase Plan</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='screenshot_area p_120' id='screen'>
        <div className='container'>
          <div className='main_title'>
            <h2>Unique Screenshots</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className='screenshot_inner owl-carousel owl-loaded owl-drag'>

            <div className='owl-stage-outer'>
              <div className='owl-stage' style={{ transform: 'translate3d(-1102px, 0px, 0px)', transition: 'all 0s ease 0s', width: '2204px' }}>
                <div className='owl-item cloned' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-3.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item cloned' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-4.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-1.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-2.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item active' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-3.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item active' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-4.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item cloned' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-1.jpg' alt='' />
                  </div>
                </div>
                <div className='owl-item cloned' style={{ width: '245.5px', marginRight: '30px' }}>
                  <div className='item'>
                    <img src='img/feature/feature-2.jpg' alt='' />
                  </div>
                </div>
              </div>
            </div>
            <div className='owl-nav disabled'>
              <div className='owl-prev'>prev</div>
              <div className='owl-next'>next</div>
            </div>
            <div className='owl-dots disabled' />
          </div>
        </div>
      </section>

      <section className='testimonials_area p_120'>
        <div className='container'>
          <div className='main_title'>
            <h2>Testimonials</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore  et dolore magna aliqua.</p>
          </div>
          <div className='testi_slider owl-carousel'>
            <div className='item'>
              <div className='testi_item'>
                <div className='media'>
                  <div className='d-flex'>
                    <img src='img/testimonials/testi-1.png' alt='' />
                  </div>
                  <div className='media-body'>
                    <p>Accessories Here you can find the best computer accessory for your laptop, monitor, printer, scanner, speaker, projector, hardware.</p>
                    <h4>Mark Alviro Wiens</h4>
                    <h5>CEO at Google</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='item'>
              <div className='testi_item'>
                <div className='media'>
                  <div className='d-flex'>
                    <img src='img/testimonials/testi-2.png' alt='' />
                  </div>
                  <div className='media-body'>
                    <p>Accessories Here you can find the best computer accessory for your laptop, monitor, printer, scanner, speaker, projector, hardware.</p>
                    <h4>Mark Alviro Wiens</h4>
                    <h5>CEO at Google</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='download_app_area p_120'>
        <div className='container'>
          <div className='app_inner'>
            <h2>Download This App Today!</h2>
            <p>It won’t be a bigger problem to find one video game lover in your neighbor. Since the introduction of Virtual Game, it has been achieving great heights so far as its popularity and technological advancement are concerned.</p>
            <div className='app_btn_area'>
              <div className='app_btn'>
                <div className='media'>
                  <div className='d-flex'>
                    <i className='fa fa-apple' aria-hidden='true' />
                  </div>
                  <div className='media-body'>
                    <a href='#'><h4>Available</h4></a>
                    <p>on App Store</p>
                  </div>
                </div>
              </div>
              <div className='app_btn'>
                <div className='media'>
                  <div className='d-flex'>
                    <i className='fa fa-android' aria-hidden='true' />
                  </div>
                  <div className='media-body'>
                    <a href='#'><h4>Available</h4></a>
                    <p>on App Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='latest_news_area p_120'>
        <div className='container'>
          <div className='main_title'>
            <h2>Latest News</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore  et dolore magna aliqua.</p>
          </div>
          <div className='latest_news_inner row'>
            <div className='col-lg-4'>
              <div className='l_news_item'>
                <a className='date' href='#'>10 April, 2018</a>
                <a href='#'><h4>Benjamin Franklin Method Of Habit Formation</h4></a>
                <p>There are many kinds of narratives and organizing principles. Science is driven by evidence gathered in experiments, and by the falsification of extant theories and their </p>
                <div className='post_view'>
                  <a href='#'><i className='fa fa-eye' aria-hidden='true' /> 4.5k Views</a>
                  <a href='#'><i className='fa fa-commenting' aria-hidden='true' /> 07</a>
                  <a href='#'><i className='fa fa-reply' aria-hidden='true' /> 362</a>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='l_news_item'>
                <a className='date' href='#'>10 April, 2018</a>
                <a href='#'><h4>Benjamin Franklin Method Of Habit Formation</h4></a>
                <p>There are many kinds of narratives and organizing principles. Science is driven by evidence gathered in experiments, and by the falsification of extant theories and their </p>
                <div className='post_view'>
                  <a href='#'><i className='fa fa-eye' aria-hidden='true' /> 4.5k Views</a>
                  <a href='#'><i className='fa fa-commenting' aria-hidden='true' /> 07</a>
                  <a href='#'><i className='fa fa-reply' aria-hidden='true' /> 362</a>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='l_news_item'>
                <a className='date' href='#'>10 April, 2018</a>
                <a href='#'><h4>Benjamin Franklin Method Of Habit Formation</h4></a>
                <p>There are many kinds of narratives and organizing principles. Science is driven by evidence gathered in experiments, and by the falsification of extant theories and their </p>
                <div className='post_view'>
                  <a href='#'><i className='fa fa-eye' aria-hidden='true' /> 4.5k Views</a>
                  <a href='#'><i className='fa fa-commenting' aria-hidden='true' /> 07</a>
                  <a href='#'><i className='fa fa-reply' aria-hidden='true' /> 362</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className='footer-area p_120'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-3  col-md-6 col-sm-6'>
              <div className='single-footer-widget tp_widgets'>
                <h6 className='footer_title'>Top Products</h6>
                <ul className='list'>
                  <li><a href='#'>Managed Website</a></li>
                  <li><a href='#'>Manage Reputation</a></li>
                  <li><a href='#'>Power Tools</a></li>
                  <li><a href='#'>Marketing Service</a></li>
                </ul>
              </div>
            </div>
            <div className='col-lg-5 col-md-6 col-sm-6'>
              <div className='single-footer-widget news_widgets'>
                <h6 className='footer_title'>Newsletter</h6>
                <p>You can trust us. we only send promo offers, not a single spam.</p>
                <div id='mc_embed_signup'>
                  <form target='_blank' action='https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01' method='get' className='subscribe_form relative'>
                    <div className='input-group d-flex flex-row'>
                      <input name='EMAIL' placeholder='Your email address' required='' type='email' />
                      <button className='btn sub-btn'>Get Started</button>
                    </div>
                    <div className='mt-10 info' />
                  </form>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-6 offset-lg-1'>
              <div className='single-footer-widget instafeed'>
                <h6 className='footer_title'>Instagram Feed</h6>
                <ul className='list instafeed d-flex flex-wrap'>
                  <li><img src='img/instagram/Image-01.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-02.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-03.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-04.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-05.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-06.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-07.jpg' alt='' /></li>
                  <li><img src='img/instagram/Image-08.jpg' alt='' /></li>
                </ul>
              </div>
            </div>
          </div>
          <div className='row footer-bottom d-flex justify-content-between align-items-center'>
            <p className='col-lg-8 col-md-8 footer-text m-0'>
                    Copyright &copy;All rights reserved | This template is made with <i className='fa fa-heart-o' aria-hidden='true' />
                    by <a href='https://colorlib.com' target='_blank'>Colorlib</a>
            </p>
            <div className='col-lg-4 col-md-4 footer-social'>
              <a href='#'><i className='fa fa-facebook' /></a>
              <a href='#'><i className='fa fa-twitter' /></a>
              <a href='#'><i className='fa fa-dribbble' /></a>
              <a href='#'><i className='fa fa-behance' /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
