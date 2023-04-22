import { Router } from "express";
import DashboardController from "../../controllers/dashboard/dashboard.controller";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import SitePagesController from "../../controllers/website/pages";
import { UserAuthonticat } from "../../middelwares/websit/userAuthonticate";
import { FavoritProductsController } from "../../controllers/dashboard/favoritProducts.controller";
import { ShopingCartController } from "../../controllers/dashboard/shopingCart.controller";
import { Orders } from "../../controllers/dashboard/orders.controller";
import { ProductController } from "../../controllers/dashboard/products.controllers";
import { UserSearch } from "../../controllers/dashboard/userSearch.controller";
import { TestmonialsController } from "../../controllers/dashboard/testmonials.controllers";
class SitePageRoutes {
  public Router: Router;
  private sitePagesController: SitePagesController;
  private favoritProductsController: FavoritProductsController;
  private shopingCartController: ShopingCartController;
  private productController: ProductController;
  private userSearch: UserSearch;
  private orders: Orders;
  private testmonialsController: TestmonialsController;
  private userAuthonticat: UserAuthonticat;
  constructor() {
    this.sitePagesController = new SitePagesController();
    this.favoritProductsController = new FavoritProductsController();
    this.shopingCartController = new ShopingCartController();
    this.productController = new ProductController();
    this.userSearch = new UserSearch();
    this.orders = new Orders();
    this.testmonialsController = new TestmonialsController();
    this.userAuthonticat = new UserAuthonticat();
    this.Router = Router();
    this.routes();
  }
  routes() {
    this.Router.get("/home", this.sitePagesController.home);
    this.Router.get("/all-categorys", this.sitePagesController.allCategorys);
    this.Router.get("/all-products", this.sitePagesController.allProducts);
    this.Router.get("/contact-us", this.sitePagesController.contactUs);
    this.Router.get("/faqs", this.sitePagesController.faqs);
    // product details page with hir slug
    this.Router.get(
      "/search-product",
      this.productController.findAllProductFromSearch
    );
    // start add user search if he registed
    this.Router.post(
      "/add-user-search",
      this.userAuthonticat.isAuthonticate,
      this.userSearch.addUserSearch
    );

    // product details page with hir slug
    this.Router.get(
      "/product-Details/:slug",
      this.sitePagesController.productDetails
    );
    // this route about show comments
    this.Router.get(
      "/all-comments/:slug",
      this.sitePagesController.allComments
    );
    // this route about add to favorit
    this.Router.post(
      "/add-to-favorit-cart",
      this.userAuthonticat.isAuthonticate,
      this.favoritProductsController.addFavoritProduct
    );
    // show all favorit products in cart
    this.Router.get(
      "/favorit-cart",
      this.userAuthonticat.isAuthonticate,
      this.favoritProductsController.showFavoritCart
    );
    // this route about add to cart
    this.Router.post(
      "/add-to-shoping-cart",
      this.userAuthonticat.isAuthonticate,
      this.shopingCartController.addShopingCart
    );
    // this route about all product in shoping cart
    this.Router.get(
      "/shoping-cart",
      this.userAuthonticat.isAuthonticate,
      this.shopingCartController.showShopingCart
    );
    // this route about change product count in shoping cart
    this.Router.post(
      "/shoping-cart-count",
      this.userAuthonticat.isAuthonticate,
      this.shopingCartController.changeCountInShopCart
    );
    // this route about macking order
    this.Router.get(
      "/mack-order",
      this.userAuthonticat.isAuthonticate,
      this.orders.showOrderPage
    );
    this.Router.post(
      "/mack-order",
      this.userAuthonticat.isAuthonticate,
      this.orders.addOrderPost
    );
    // this route about show testmonials
    this.Router.get("/testmonials", this.sitePagesController.showTestmonials);
    // this route about add testmonials
    this.Router.post(
      "/add-testmonials",
      this.userAuthonticat.isAuthonticate,
      this.testmonialsController.crearePost
    );
  }
}

export default SitePageRoutes;
