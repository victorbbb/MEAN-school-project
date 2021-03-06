groceryApp.controller('cartController',['$scope','apiService', ($scope,apiService) => {
    
    //$scope.topass = { a: 1, b: 2};

    $scope.payForm = ['','','','','','',''];

    if(window.location.hash !== '#!/checkout' && window.location.hash !== '#!/checkouterr'){
        $scope.sideBar = true;
        document.getElementById('mainView').className = 'col-md-9 trans-div-store';
    }
    else{
        $scope.sideBar = false;
        document.getElementById('mainView').className = 'col-md-12 trans-div-store';
    }

        
    window.addEventListener('hashchange', () => {
            
        if(window.location.hash == '#!/checkout' || window.location.hash == '#!/checkouterr'){
            $scope.$apply(()=>{
                $scope.sideBar = false;
                document.getElementById('mainView').className = 'col-md-12 trans-div-store';
            });
        }
        else{
            $scope.$apply(()=>{
                $scope.sideBar = true;
                document.getElementById('mainView').className = 'col-md-9 trans-div-store';
            });
        }

    });

    
    apiService.getAllProducts().then(data => {
        
        $scope.products = data.data;
        
    })
    
    apiService.getCategories().then(data => {
        
        $scope.categories = data.data;
        
    })
    
    apiService.getCart().then(data =>{
        if(data.data.products.length>0){
            $scope.cart = data.data;
        }
        else{
            console.log('no cart');
        }
    })
    
    
    
    $scope.productClicked = e => {

        $scope.sideBar = true;
        document.getElementById('mainView').className = 'col-md-9 trans-div-store';
        
        apiService.getProduct(e.target.id).then( data => {
            
            $scope.product = data.data[0];
            $scope.product.q = 1;

          });

        }


    $scope.addProduct = () => {

        apiService.addProductToCart($scope.product).then( data =>{

            $scope.cart = data.data;

        });

    }


    $scope.changeCategory = event => {

        $scope.currentCategory = event.currentTarget.id.slice(12);

    }


    $scope.checkoutClicked = () =>{
        $scope.errors = [];
    } 

    $scope.showErrors = () => {

        $scope.showErrorMessage = [];

        $scope.errorMessages = [
            'choose city',
            'address is required',
            'choose date',
            'credit card owner name is required',
            'you must enter a valid cvv number',
            'you must enter a valid credit card number to pay',
            'enter month',
            'enter year'
        ]

        if($scope.errors.length > 0){
            $scope.errors.forEach(error => {
                if(error !== '0' && error  !== '2' && error !== '6' && error !== '7'){
                    $scope.payForm[error] = $scope.errorMessages[error];
                    document.getElementById('payForm_' + error).style.color="red";
                    document.getElementById('payForm_' + error).style.border="2px solid red";
                }
                else{
                    $scope.showErrorMessage.push($scope.errorMessages[error]);
                    document.getElementById('payForm_' + error).style.border="2px solid red";
                }
            })
        }

    }


    $scope.pay = () =>{
        
        paymentDetails = [$scope.payForm[0], $scope.payForm[1], $scope.payForm[2], $scope.payForm[3], $scope.payForm[4], $scope.payForm[5], $scope.payForm[6], $scope.payForm[7]];

        apiService.pay(paymentDetails, $scope.cart).then( data => {
            if(data.data.errors){
                $scope.errors = data.data.errors;
                $scope.showErrors();
            }

            window.location.assign(data.data.goto);

        });

    }


}]);
