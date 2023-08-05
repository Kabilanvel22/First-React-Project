import React from "react";
import "./App.css";

const { useState, useEffect, useRef } = React;

function Quote({ colorTheme, onColorRequestChange }) {
  const previousColorTheme = usePrevious(colorTheme);
  const [data, setData] = useState({ quotes: [] });
  const [randomQuote, setRandomQuote] = useState({
    quote: "",
    author: ""
  });

  const textRef = useRef(null);
  const authorRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
      );
      setData(await result.json());
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (data.quotes.length === 0) {
      return;
    }

    randomizeQuote();
  }, [data, randomQuote]);

  function randomizeQuote() {
    const newRandomQuote = Math.floor(Math.random() * data.quotes.length);
    setRandomQuote(data.quotes[newRandomQuote]);
  }

  function handleNewQuote() {
    const textElement = textRef.current;
    const authorElement = authorRef.current;

    textElement.addEventListener("transitionend", handleOpacityTransitionEnd);

    onColorRequestChange();
    textElement.style.opacity = 0;
    authorElement.style.opacity = 0;

    function handleOpacityTransitionEnd() {
      textElement.removeEventListener(
        "transitionend",
        handleOpacityTransitionEnd
      );
      randomizeQuote();

      textElement.style.opacity = 1;
      authorElement.style.opacity = 1;
    }
  }

  return (
    <div id="quote-box">
      <div id="text" ref={textRef} style={{ color: previousColorTheme }}>
        {randomQuote.quote}
      </div>
      <div id="author" ref={authorRef} style={{ color: previousColorTheme }}>
        {randomQuote.author}
      </div>

      <div id="buttons">
        <a
          id="tweet-quote"
          className="button"
          style={{ backgroundColor: colorTheme }}
          href={
            "https://twitter.com/intent/tweet?hashtags=quotes&text=" +
            encodeURI(randomQuote.quote + " -- " + randomQuote.author)
          }
          target="_top"
        >
          <i className="fa fa-twitter">Twitter</i>
        </a>
        <a
          id="tumblr-quote"
          className="button"
          style={{backgroundColor: colorTheme}}
          href={
            "https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=" +
            encodeURI(randomQuote.quote + " -- " + randomQuote.author)
          }
          target="_top"
          >
          <i className="fa fa-tumblr">Tumblr</i>
          </a>
        <button
          id="new-quote"
          className="button"
          style={{ backgroundColor: colorTheme }}
          onClick={handleNewQuote}
        >
          New Quote
        </button>
      </div>
    </div>
  );
}

const colors = ["red", "green", "blue", "brown", "orange", "dodgerblue"];

function App() {
  const [colorIndex, setColorIndex] = useState(0);

  const colorTheme = colors[colorIndex];

  function handleColorRequestChange() {
    setColorIndex((colorIndex + 1) % colors.length);
  }

  return (
    <div id="app" style={{ backgroundColor: colorTheme }}>
      <div>
        <Quote
          {...{ colorTheme }}
          onColorRequestChange={handleColorRequestChange}
        />
      </div>
    </div>
  );
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default App;
