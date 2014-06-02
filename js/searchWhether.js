var currentCityCoord = { lat: null, lon: null };

function SPWeatherReport($scope, $http, $templateCache) {
	$scope.method = 'GET';
	$scope.url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Rajkot&cnt=14&APPID=a1d92644a413999cfc40d23bdf3a6e88';
	$scope.cities = Array();
	$scope.report = Array();
	$scope.showMessage = false;
	
	$scope.searchWeather = function() {
		$scope.code = null;
		$scope.response = null;
		
		angular.forEach( $scope.cities, function(city){
			$scope.report.pop(city);
		});
		
		$scope.cities = Array();
		$scope.showMessage = false;
		
		if( $scope.spCities ) {
			angular.forEach($scope.spCities.split(','), function(city){
				if( city ) {
					city = city.trim();
					$scope.cities.push({name: city, text: 'City'});
					$index = $scope.cities.length - 1;
					$scope.report[city] = Array();
					$scope.report[city]["loading"] = true;
					$scope.url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&cnt=14&APPID=a1d92644a413999cfc40d23bdf3a6e88';
					
					$http({method: $scope.method, url: $scope.url, cache: $templateCache, responseType: 'JSON'}).
					success(function(data, status) {
						if( 200 == status ) {
							lat = data.city.coord.lat;
							lon = data.city.coord.lon;
							$scope.cities[$index].lat = lat.toFixed(2);
							$scope.cities[$index].lon = lon.toFixed(2);
							$city = data.city.name;
							$scope.report[$city]["weather"] = Array();
							var dt = new Date();
							
							angular.forEach( data.list, function( $report ) { 
								dt.setTime($report.dt * 1000);
								$report.dt = dt.toDateString();
								
								if( $scope.report[$city]["weather"].length == 0 ) {
									$report.dt = "Today";
								}
								
								$report.weather = $report.weather[0];
								$scope.report[$city]["weather"].push($report);
							});
							$scope.report[$city]["loading"] = false;
						} else {
							alert( 'Error fetching data' );
						}
					}).
					error(function(data, status) {
						$scope.data = data || "Request failed";
						$scope.status = status;
					});
				}
			});
			$scope.spCities = '';
		} else {
			$scope.showMessage = true;
		}
	};
	
	$scope.searchWeatherCoord = function() {
		$scope.code = null;
		$scope.response = null;
		
		angular.forEach( $scope.cities, function(city){
			$scope.report.pop(city);
		});
		
		$scope.cities = Array();
		$scope.showMessage = false;
		
		if( ( currentCityCoord.lat != null ) && ( currentCityCoord.lon != null ) ) {
			$scope.url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + currentCityCoord.lat + '&lon=' + currentCityCoord.lon + '&cnt=14&APPID=a1d92644a413999cfc40d23bdf3a6e88';
			
			$http({method: $scope.method, url: $scope.url, cache: $templateCache, responseType: 'JSON'}).
			success(function(data, status) {
				if( 200 == status ) {
					$city = data.city.name;
					$scope.report[$city] = Array();
					$scope.report[$city]["loading"] = true;
					lat = data.city.coord.lat;
					lon = data.city.coord.lon;
					$scope.cities.push({name: $city, text: 'Current City', lat: lat.toFixed(2), lon: lon.toFixed(2)});
					$scope.report[$city]["weather"] = Array();
					var dt = new Date();
					
					angular.forEach( data.list, function( $report ) { 
						dt.setTime($report.dt * 1000);
						$report.dt = dt.toDateString();
						
						if( $scope.report[$city]["weather"].length == 0 ) {
							$report.dt = "Today";
						}
						
						$report.temp = {day: $report.main.temp, min: $report.main.temp_min, max: $report.main.temp_max};
						
						$report.weather = $report.weather[0];
						$scope.report[$city]["weather"].push($report);
					});
					$scope.report[$city]["loading"] = false;
				} else {
					alert( 'Error fetching data' );
				}
			}).
			error(function(data, status) {
				
			});
		} else {
			alert('Hello');
		}
	};
}

function showPosition(position)
{
	currentCityCoord = {lat: position.coords.latitude.toFixed(2), lon: position.coords.longitude.toFixed(2)};
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
}