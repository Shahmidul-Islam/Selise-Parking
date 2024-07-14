var app = angular.module('parkingApp', []);

app.controller('ParkingController', function ($scope) {
    $scope.vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    $scope.vehicle = {};
    $scope.totalSlots = 50;

    $scope.addOrUpdateVehicle = function () {
        if ($scope.editing) {
            $scope.vehicles[$scope.editIndex] = $scope.vehicle;
            $scope.editing = false;
        } else {
            $scope.vehicles.push($scope.vehicle);
        }
        $scope.vehicle = {};
        localStorage.setItem('vehicles', JSON.stringify($scope.vehicles));
        $scope.updateDashboard();
    };

    $scope.editVehicle = function (vehicle) {
        $scope.vehicle = angular.copy(vehicle);
        $scope.editing = true;
        $scope.editIndex = $scope.vehicles.indexOf(vehicle);
    };

    $scope.filterVehicles = function () {
        let filteredVehicles = $scope.vehicles.filter(v => new Date(v.entryTime).toDateString() === new Date($scope.filterDate).toDateString());
        $scope.updateDashboard(filteredVehicles);
    };

    $scope.updateDashboard = function (filteredVehicles) {
        let vehicles = filteredVehicles || $scope.vehicles;
        $scope.totalCars = vehicles.length;
        $scope.vehicleTypeInfo = vehicles.reduce((acc, v) => {
            acc[v.type] = (acc[v.type] || 0) + 1;
            return acc;
        }, {});
        $scope.longParkedVehicles = vehicles.filter(v => v.status === 'in' && (new Date() - new Date(v.entryTime)) / (1000 * 60 * 60) > 2);
        $scope.totalSlots = 50 - $scope.totalCars;
    };

    $scope.filterDate = new Date().toISOString().split('T')[0];
    $scope.filterVehicles();
});
