console.log('app.js linked!');
angular
    .module('bookApp', ['ngRoute'])
    .config(config)
    .controller('HomeController', HomeController)
    .controller('BookController', BookController);

config.$inject = ['$routeProvider', '$locationProvider'];

function config($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl'
        })
        .when('/:id', {
            templateUrl: '/templates/book.html',
            controller: 'BookController',
            controllerAs: 'bookCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
};

HomeController.$inject = ['$http'];

function HomeController($http) {
    var vm = this;

    $http({
        method: 'GET',
        url: 'https://super-crud.herokuapp.com/books'
    }).then(function getSuccess(response) {
        console.log(response);
        vm.books = response.data.books;
    }, function getError(error) {
        console.log('error is: ', error);
    })
}


BookController.$inject = ['$routeParams', '$http', '$location'];

function BookController($routeParams, $http, $location) {
    var vm = this;
    $http({
        method: 'GET',
        url: 'https://super-crud.herokuapp.com/books/' + $routeParams.id
    }).then(function getBookSuccess(response) {
        vm.oneBook = response.data;
    }, function getBookError(error) {
        console.log('error is ', error);
    })

    vm.deleteBook = function(book) {
        $http({
            method: 'DELETE',
            url: 'https://super-crud.herokuapp.com/books/' + $routeParams.id
        }).then(function deleteBookSuccess(response) {
            $location.path('/')
            console.log('deleted book: ', response);
        }, function deleteBookError(error) {
            console.log('error is: ', error);
        })
    }

    vm.editBook = function(editedBook) {
			$http({
				method: 'PUT',
				url: 'https://super-crud.herokuapp.com/books/' + $routeParams.id,
				data: editedBook
			}).then(function editBookSuccess(response) {
				$location.path('/');
			}, function editBookError(error) {
				console.log('error: ', error);
			})
    }

		vm.cancelEdit = function() {
			console.log('cancelling edit');
			$location.path('/');
		}

}
