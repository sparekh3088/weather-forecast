function SPWeatherReport($scope, $http, $templateCache) {
	$scope.method = 'GET';
	$scope.url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Rajkot&cnt=14&APPID=a1d92644a413999cfc40d23bdf3a6e88';
	$scope.cities = Array();
	
	$scope.searchWeather = function() {
		$scope.code = null;
		$scope.response = null;
		angular.forEach($scope.spCities.split(','), function(city){
				$scope.cities.push({name:city});
			});
			$scope.spCities = '';
		$http({method: $scope.method, url: $scope.url, cache: $templateCache, responseType: 'JSON'}).
		success(function(data, status) {
			$scope.status = status;
			$scope.data = data;
		}).
		error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	};
}