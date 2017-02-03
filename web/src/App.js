import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Link from './components/Link';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import PageContainer from './components/PageContainer';
import SharePage from './pages/SharePage';
import { colors, padding } from './styles/variables';
import { tryDecodeURI, removeIllegalCharacters } from './utils/helpers';

// fix github page router path handler
const basename = window.location.hostname.indexOf('github') >= 0 &&
  window.location.pathname.split('/')[1]
  ? `/${window.location.pathname.split('/')[1]}`
  : undefined;

const ProductHuntHeader = styled.header`
  background-color: #da552f;
  padding: ${padding}px;
  text-align: center;

  p {
    color: #fff;
  }
`;

const MessageHeader = styled.header`
  padding: ${padding}px;
  text-align: center;

  p {
    color: lightyellow;
  }
`;

export default class extends Component {
  state = { backgroundColor: colors.blue, message: '' };

  setMessage = message => {
    this.setState({ message });
  };

  changeBackgroundColor = backgroundColor => {
    this.setState({ backgroundColor });
  };

  render() {
    const { backgroundColor, message } = this.state;

    if (window.location.search.indexOf('ref=producthunt') >= 0) {
      localStorage.fromProductHunt = true;
    }

    return (
      <Router basename={basename}>
        <PageContainer background={backgroundColor}>
          {
          !localStorage.fromProductHunt &&
          <ProductHuntHeader>
            <img
              src={`${process.env.PUBLIC_URL}/img/producthunt-kitty-logo.png`}
              height="40"
            />
            <p>
              <a
                href="https://www.producthunt.com/posts/is-now-illegal"
                target="_blank"
              >
                We are on Product Hunt! Check it out!
              </a>
            </p>
          </ProductHuntHeader>
        }
          <MessageHeader>
            {message && <p>{message}</p>}
          </MessageHeader>
          <Switch>
            <Route
              path="/"
              render={props => {
                const urlParam = window.location.search[0] === '?'
                  ? window.location.search.replace('?', '')
                  : '';

                const possibleSubject = removeIllegalCharacters(urlParam);

                if (possibleSubject && possibleSubject === urlParam) {
                  return (
                    <SharePage subject={tryDecodeURI(possibleSubject)} {...props} />
                  );
                }

                return <MainPage {...props} />;
              }}
              changeBackgroundColor={this.changeBackgroundColor}
              setMessage={this.setMessage}
              exact
            />
            <Route
              path="/:subject"
              render={({ match: { params: { subject } }, ...props }) => (
                <SharePage subject={tryDecodeURI(subject)} {...props} />
              )}
              changeBackgroundColor={this.changeBackgroundColor}
              setMessage={this.setMessage}
            />
          </Switch>
          <Footer>
            <p>
              <Link
                className="github-button"
                href="https://github.com/ivanseidel/Is-Now-Illegal"
                data-style="mega"
                data-count-href="/ivanseidel/Is-Now-Illegal/stargazers"
                data-count-api="/repos/ivanseidel/Is-Now-Illegal#stargazers_count"
                data-count-aria-label="# stargazers on GitHub"
                aria-label="Star ivanseidel/Is-Now-Illegal on GitHub"
              >
                Star on GitHub
              </Link>
            </p>
            <p>A nerdy protest made by </p>
            <p>
              <Link href="https://github.com/ivanseidel" target="_blank">
                Ivan Seidel
              </Link>
              {', '}
              <Link href="https://twitter.com/brunolemos" target="_blank">
                Bruno Lemos
              </Link>
              {' & '}
              <Link href="https://github.com/joaopedrovbs" target="_blank">
                João Pedro
              </Link>
            </p>
          </Footer>
        </PageContainer>
      </Router>
    );
  }
}
