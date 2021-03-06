import CONFIG from '../globals/config';

const { BASE_IMAGE_URL } = CONFIG;
const template = document.createElement('template');

template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }

    a {
      display: inline-block;
      min-height: 48px;
      min-width: 48px;
    }

    .container {
      width: 100%;
      min-width: 200px;
      overflow: hidden;
      border: 4px solid black;
      background-color: #fff;
      box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);
    }

    .picture-wrapper {
      position: relative;
      width: 100%;
      height: 10em;
    }
    
    .picture-wrapper > lazy-img {
      width: 100%;
      height: 100%;
    }
    
    .picture-wrapper > span {
      background-color: white;
      position: absolute;
      top: 1em;
      left: 0;
      padding: 0.5em 0.5em 0.5em 1.5em;
      background-color: black;
      color: white;
    }
    
    .like-button {
      border: none;
      position: absolute;
      top: 0;
      right: 0.2em;
      background-color: white;
      font-weight: bold;
      font-size: 2.5em;
      color: grey;
      width: 56px;
      height: 56px;
      cursor: pointer;
    }

    .like-button:hover {
      height: 60px;
    }

    .like-button.liked {
      color: red;
    }

    .description-wrapper {
      padding: 1em;
    }
    
    .description-wrapper > span {
      color: black;
    }

    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      min-width: 0
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      font-weight: bold;
      color: black;
      line-height: 48px;
    }
  </style>
    
  <div class="container">
    <div class="picture-wrapper">
      <lazy-img crossorigin="anonymous"></lazy-img>
      <span class="city"></span>
      <button class="like-button" aria-label="like">&hearts;</button>
    </div>
    <div class="description-wrapper">
      <span class="rating"></span>
      <p><a class="name"></a></p>
      <p class="description"></p>
    </div>
  </div>
`;

class RestaurantCard extends HTMLElement {
  static get observedAttributes() {
    return ['details', 'liked'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$image = this._shadowRoot.querySelector('lazy-img');
    this.$city = this._shadowRoot.querySelector('.city');
    this.$rating = this._shadowRoot.querySelector('.rating');
    this.$name = this._shadowRoot.querySelector('.name');
    this.$link = this._shadowRoot.querySelector('a');
    this.$description = this._shadowRoot.querySelector('.description');
    this.$likeBtn = this._shadowRoot.querySelector('.like-button');
    this.$likeBtn.addEventListener('click', () => {
      const eventName = this.liked ? 'unlike' : 'like';

      this.dispatchEvent(
        new CustomEvent(eventName),
      );
    });

    this.liked = false;
  }

  get details() {
    return JSON.parse(this.getAttribute('details'));
  }

  set details(value) {
    this.setAttribute('details', JSON.stringify(value));
  }

  get liked() {
    return this.hasAttribute('liked');
  }

  set liked(value) {
    if (value) {
      this.setAttribute('liked', '');
    } else {
      this.removeAttribute('liked');
    }
  }

  get button() {
    return this.$likeBtn;
  }

  attributeChangedCallback(name) {
    if (name === 'details') {
      this._populateCard();
    } else if (name === 'liked') {
      const isLiked = this.hasAttribute('liked');
      this._toggleLikeButton(isLiked);
    }
  }

  _populateCard() {
    const {
      id, pictureId, name, description, city, rating,
    } = this.details;
    const imgSrc = `${BASE_IMAGE_URL}/small/${pictureId}`;

    this.$image.setAttribute('src', imgSrc);
    this.$image.setAttribute('alt', name);
    this.$image.classList.add('lazyload');
    this.$city.innerText = city;
    this.$rating.innerText = `Rating: ${rating}`;
    this.$name.innerText = name;
    this.$name.href = `/#/detail/${id}`;
    this.$description.innerText = description;
  }

  _toggleLikeButton(newVal) {
    if (newVal) {
      this.$likeBtn.classList.add('liked');
    } else {
      this.$likeBtn.classList.remove('liked');
    }
  }
}

customElements.define('restaurant-card', RestaurantCard);
