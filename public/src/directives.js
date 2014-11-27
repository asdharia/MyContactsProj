angular.module('ContactsApp')
    .value('FieldTypes',{
			text:['Text','should be Text'],
			email:['Email','should be Email'],
			number:['Number','should be Number'],
			date:['Date','should be Date'],
			dateTime:['Datetime','should be Datetime'],
			url:['URL','should be URL'],
			time:['Time','should be Time'],
			month:['Month','should be Month'],
			week:['Week','should be Week'],
			tel:['Phone Number','should be Phone Number'],
			color:['Color','should be Color']
    })
    .directive('formField',function($timeout, FieldTypes){
    	return {
    		restrict:'EA',
    		templateUrl:'views/form-field.html',
    		replace:true,
    		scope:{
    			  record   : '=',
    			  field    : '@',
    			  live     : '@',
    			  required : '@'
    		    },
    		link: function($scope, element, attr){
                
                $scope.$on('record:invalid', function(){
                    $scope[$scope.field].$setDirty();                    
                });
    			
                $scope.types = FieldTypes;

    			$scope.remove=function(field){
    				delete $scope.record[field];
    				$scope.blurUpdate();
    			};
    			$scope.blurUpdate=function(){
    				if($scope.live !== 'false')
    				{
    					$scope.record.$update(function(updatedRecord){
    						$scope.record = updatedRecord;
    					});
    				}
    			};
    			var saveTimeout;
    			$scope.update = function(){
    				$timeout.cancel(saveTimeout);
    				saveTimeout =$timeout($scope.blurUpdate, 1000);
    			};
    		}
    	};
    });