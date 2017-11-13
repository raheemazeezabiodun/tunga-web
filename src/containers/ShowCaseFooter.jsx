import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import * as UtilityActions from '../actions/UtilityActions';

class ShowCaseFooter extends React.Component {
  componentDidMount() {
    const {UtilityActions} = this.props;
    UtilityActions.getMediumPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.Utility.contact.isSent &&
      !prevProps.Utility.contact.isSent
    ) {
      this.refs.contact_form.reset();
    }
  }

  sendEmail(e) {
    e.preventDefault();
    const email = this.refs.email.value.trim();
    const {UtilityActions} = this.props;
    UtilityActions.sendContactRequest({email});
    return;
  }

  render() {
    const {Utility} = this.props;

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-3" id="social">
              <div id="tunga-logo-btm">
                <img src={require('../images/logo_round.png')} />
              </div>
              <div id="social-networks">
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/tunga"
                  id="fb"
                  title="LinkedIn">
                  <i className="fa fa-linkedin" />
                </a>
                <a
                  target="_blank"
                  href="https://www.facebook.com/tunga.io"
                  id="fb"
                  title="Facebook">
                  <i className="fa fa-facebook" />
                </a>
                <a
                  target="_blank"
                  href="https://twitter.com/tunga_io"
                  id="twitter"
                  title="Twitter">
                  <i className="fa fa-twitter" />
                </a>
                <a
                  target="_blank"
                  href="https://blog.tunga.io"
                  id="medium"
                  title="Medium">
                  <i className="fa fa-medium" />
                </a>
              </div>
            </div>
            <div className="col-md-6" id="contact-info">
              <h4>Contact & legal information</h4>
              <p>
                <i className="fa fa-map-marker" /> Ms van Riemsdijkweg 57, 1033RC
                Amsterdam, The Netherlands
              </p>
              <p>
                <i className="fa fa-phone" /> +31(0)615955194{' '}
              </p>
              <p>
                <i className="fa fa-envelope" />{' '}
                <a href="mailto:hello@tunga.io" target="_blank">
                  hello@tunga.io
                </a>
              </p>

              <div>
                <p>
                  <a href="/privacy" target="_blank">
                    Privacy Policy
                  </a>{' '}
                  &nbsp; | &nbsp;{' '}
                  <a href="/agreement" target="_blank">
                    Terms and Conditions
                  </a>{' '}
                  &nbsp; | &nbsp;{' '}
                  <a href="/code-of-conduct" target="_blank">
                    Code of Conduct
                  </a>
                </p>
                <small>
                  &copy; {moment().format('YYYY')} Tunga.io &mdash; All rights
                  reserved.
                </small>
              </div>
            </div>
            <div className="col-md-3" id="latest-from-blog">
              <h4>Latest from our blog</h4>
              <ul className="list-unstyled">
                {Utility.posts.length
                  ? Utility.posts.slice(0, 4).map((article, idx) => {
                  return (
                    <li key={idx}>
                      <a target="_blank" href={article.url}>
                        <i className="fa fa-angle-right" /> {article.title}
                      </a>
                    </li>
                  );
                })
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(state) {
  return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
  return {
    UtilityActions: bindActionCreators(UtilityActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowCaseFooter);
