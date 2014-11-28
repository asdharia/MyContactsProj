angular.module('ContactsApp')
       .controller('ListController', function($scope, Contact, $location){
          console.log('ListController//Start.......');
       		$scope.contacts = Contact.query();
       		$scope.fields   = ['firstName','lastName','email','cellPhone'];

       		$scope.sort = function(field){
       				$scope.sort.field = field;
       				$scope.sort.order = !$scope.sort.order;
       			};
	       $scope.sort.field = 'firstName';
    	   $scope.sort.order = false;

    	   $scope.show = function(id){
    	   	$location.url ('/contacts/'+id);
    	   };
   })
        .controller('NewController', function($scope, Contact, $location){
          console.log('NewController//Start.......');
        	$scope.contact = new Contact({
        		firstName : [''],
        		lastName  : [''],
        		email     : [''],
        		cellPhone : ['']
        	});
        	$scope.save = function(){
            console.log('in Contact .save ');
        		if($scope.newContact.$invalid){
            console.log('in Contact invalid ');
        			$scope.$broadcast('record:invalid');
        		} else {
            console.log('in saving .save ');
        			$scope.contact.$save();
        			$location.url('/contacts');
        		}
        	};
   })
        .controller('EditController', function($scope, Contact, $location, $routeParams){
          console.log('EditController//Start.......'+$routeParams.id);
          $scope.contact = new Contact.get({id:parseInt($routeParams.id,10)});
          $scope.delete  = function(){
                    console.log('EditController.Delete//Start.......');
                    $scope.contact.$delete();
                    $location.url('/contacts');
                  }; 
   });
