// © Manuel Matuzović: https://web.dev/website-navigation/

const nav = document.querySelector('nav');
const list = nav.querySelector('ul');
const burgerClone = document.querySelector('#burger-template').content.cloneNode(true);
const svg = nav.querySelector('svg');

const button = burgerClone.querySelector('button');
button.addEventListener('click', e => {
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !isOpen);
});

// avoid DRY: disabling menu
const disableMenu = () => {
  button.setAttribute('aria-expanded', false);
};

//  close on escape
nav.addEventListener('keyup', e => {
  if (e.code === 'Escape') {
    disableMenu();
  }
});

// close if clicked outside of event target
document.addEventListener('click', e => {
  const isClickInsideElement = nav.contains(e.target);
  if (!isClickInsideElement) {
    disableMenu();
  }
});

nav.insertBefore(burgerClone, list);

// ----- masonry fallback if CSS masonry not supported, solution by Ana Tudor: https://codepen.io/thebabydino/pen/yLYppjK

const supportMasonry = CSS.supports('grid-template-rows', 'masonry');

if (!supportMasonry) {
  let grids = [...document.querySelectorAll('.grid[data-rows="masonry"]')];

  if (grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
    grids = grids.map(grid => ({
      _el: grid,
      gap: parseFloat(getComputedStyle(grid).gridRowGap),
      items: [...grid.childNodes]
        .filter(c => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1)
        .map(c => ({ _el: c })),
      ncol: 0
    }));

    function layout() {
      grids.forEach(grid => {
        /* get the post relayout number of columns */
        let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

        /* if the number of columns has changed */
        if (grid.ncol !== ncol) {
          /* update number of columns */
          grid.ncol = ncol;

          /* revert to initial positioning, no margin */
          grid.items.forEach(c => c._el.style.removeProperty('margin-top'));

          /* if we have more than one column */
          if (grid.ncol > 1) {
            grid.items.slice(ncol).forEach((c, i) => {
              let prev_fin =
                grid.items[i]._el.getBoundingClientRect()
                  .bottom /* bottom edge of item above */,
                curr_ini =
                  c._el.getBoundingClientRect().top; /* top edge of current item */

              c._el.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
            });
          }
        }
      });
    }

    addEventListener(
      'load',
      e => {
        layout(); /* initial load */
        addEventListener('resize', layout, false); /* on resize */
      },
      false
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const commentsContainers = document.querySelectorAll('.comments-container');

  // Function to create reactions elements
  function createReactionsElement(reactions) {
    const reactionsElement = document.createElement("div");
    reactionsElement.className = "reactions-container";
    const emojiMap = {
      "+1": "👍",
      "-1": "👎",
      "laugh": "😄",
      "hooray": "🎉",
      "confused": "😕",
      "heart": "❤️",
      "rocket": "🚀",
      "eyes": "👀"
    };

    Object.entries(reactions).forEach(([key, count]) => {
      if (count > 0 && emojiMap[key]) {
        const reactionSpan = document.createElement("span");
        reactionSpan.className = "reaction";
        reactionSpan.innerHTML = `${emojiMap[key]} ${count}`;
        reactionsElement.appendChild(reactionSpan);
      }
    });

    return reactionsElement;
  }

  // Callback function to load comments
  const loadComments = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const loader = container.querySelector('.loader');

        // Initially display the loader
        loader.style.display = 'block';

        const postId = container.getAttribute('data-postId');

        fetch(`/.netlify/functions/comments?id=${postId}`)
          .then(response => response.json())
          .then(comments => {
            if (comments.data && comments.data.length > 0) {
              loader.style.display = 'none';
              const btnContainer = document.createElement('div');
              btnContainer.className = 'btn-container';

              // Display number of comments
              const numberOfComments = document.createElement('h3');
              numberOfComments.className = 'number-of-comments'
              numberOfComments.innerText = `${comments.data.length} Comments`;

              // Link for commenting on GitHub
              const commentLink = document.createElement('a');
              commentLink.className = 'comment-btn';
              commentLink.innerText = 'Comment on GitHub';
              commentLink.href = `https://github.com/saadbess/saadbess.com/issues/${postId}`;
              commentLink.target = '_blank';

              // Display each comment
              comments.data.forEach(comment => {
                const commentInfoContainer = document.createElement('div');
                commentInfoContainer.className = 'info-container';

                // User's avatar and name
                const userAvatar = document.createElement('img');
                userAvatar.src = comment.user.avatarUrl;
                userAvatar.className = 'user-avatar';

                const userName = document.createElement('span');
                userName.className = 'user-name';
                userName.innerText = comment.user.name

                const date = document.createElement('time');
                date.className = 'comment-time';
                date.innerText = comment.datePosted;

                if (comment.isAuthor) {
                  const author = document.createElement('span');
                  author.className = 'comment-author';
                  author.innerText = 'Author';
                  commentInfoContainer.appendChild(author);
                }

                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = comment.body;

                commentInfoContainer.appendChild(userAvatar);
                commentInfoContainer.appendChild(userName);
                commentInfoContainer.appendChild(date);
                commentDiv.appendChild(commentInfoContainer);
                container.appendChild(commentDiv);

                // Add reactions to the comment if they exist
                if (comment.reactions) {
                  const reactionsElem = createReactionsElement(comment.reactions);
                  if (reactionsElem.hasChildNodes()) {
                    commentDiv.appendChild(reactionsElem);
                  }
                }
              });
            } else {
              btnContainer.appendChild(numberOfComments);
              btnContainer.appendChild(commentLink);
              container.appendChild(btnContainer);
              container.innerText = 'No comments yet. Be the first to comment!';
            }

            // Stop observing the container once the comments are loaded
            observer.unobserve(container);
          })
          .catch(error => {
            console.error("Failed fetching comments:", error);

            loader.style.display = 'none';
          });
      }
    });
  };

  // Initialize IntersectionObserver
  const options = {
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver(loadComments, options);

  // Start observing each comments container
  commentsContainers.forEach(container => observer.observe(container));
});

