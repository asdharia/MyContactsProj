angular.module('ContactsApp')
       .controller('ListController', function($scope, Contact, $location){
       		$scope.contacts = Contact.query();
       		$scope.fields   = ['firstName','lastName'];

       		$scope.sort = function(field){
       				$scope.sort.field = field;
       				$scope.sort.order = !$scope.sort.order;
       			};
	       $scope.sort.field = 'firstName';
    	   $scope.sort.order = false;

    	   $scope.show = function(id){
    	   	$location.url ('/contact/'+id);
    	   };
   })
        .controller('NewController', function($scope, Contact, $location){
        	$scope.contact = new Contact({
        		firstName : [''],
        		lastName  : [''],
        		email     : [''],
        		homePhone : [''],
        		cellPhone : [''],
        		birthday  : [''],
        		website   : [''],
        		address   : ['']
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
          $scope.contact = new Contact.get({id:parseInt($routeParams.id,10)});
          $scope.delete  = function(){
                    $scope.contact.delete();
                    $location.url('/contacts');
                  }; 
   });
