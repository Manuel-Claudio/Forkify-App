class SearchView {
    _parentEl = document.querySelector('.search');

    getQuery() {
        const query =  this._parentEl.querySelector('.search__field').value; // Gets the value from the input field/ Search Bar !!!! 
        this._clearInput();
        return query;
    };

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = ''; // To clear Search Input Field 
    };

    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    };
};

export default new SearchView();