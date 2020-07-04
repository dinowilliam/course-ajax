(function () {

    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');    
    const responseContainer = document.querySelector('#response-container');
    
    let searchedForText = 'hippos';    

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        resquestImages();
        resquestArticle();
    });

    resquestImages();
    resquestArticle();
    
    function resquestImages(){
        let unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', `Client-ID ${readTextFile("UnsplashId.txt")}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.send();
    };
    
    function addImage(){
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data && data.results && data.results[0]){
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${firstImage.description.replace(".","")} by ${firstImage.user.name}</figcaption>
            </figure>`;
        }
        else{
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    } 

    function resquestArticle(){
        let articleRequest = new XMLHttpRequest();        
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${readTextFile("NYId.txt")}`);
        articleRequest.onload = addArticles;
        articleRequest.send();
    }

    function addArticles () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data.response && data.response.docs && data.response.docs.length > 1){            
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
            </li>`).join('') + '</ul>'                
        }
        else{
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);        
    }


    function readTextFile(file){
        var allText = '';        
        var openFile = new XMLHttpRequest();

        openFile.open("GET", file, false);
        openFile.onreadystatechange = function (){
            if(openFile.readyState === 4){
                if(openFile.status === 200 || openFile.status == 0){
                    allText = openFile.responseText;                    
                }
            }
        }

        openFile.send(null);
       
        return allText;
    }   

})();


