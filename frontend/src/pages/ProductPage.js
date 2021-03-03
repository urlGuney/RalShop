import React, { useState, useEffect } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../redux/actions/productActions";
import NotFound from "./NotFound";
import LoadingIcon from "../assets/loading.gif";
import Styled from "styled-components";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import FullscreenImage from "./../components/fullscreenImage";
import { priceConverter } from "../utils/helpers";
import ReactStars from "react-rating-stars-component";
import ProductLocation from "../components/ProductLocation";
import ProductDescription from "../components/ProductDescription";

const NavDivider = Styled.span`
     font-weight:bold;
     padding-left:5px;
`;
const ProductImages = Styled.div`
     height: 100%;
     width: 100%;
     position: relative;
     height: 400px;
`;
const ImageBottomSection = Styled.section`
     display:flex;
     justify-content:space-between;
     align-items:center;
`;
const InfoRow = Styled.div`
  display: flex;
  justify-content: space-between;
  width:300px;
  padding:8px;
  padding-left:0;
`;
const TickIcon = Styled.span`
  color: white;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  bottom: -6.3px;
  left: 1px;
  text-shadow: -1px -1px black;
  visibility: hidden;
`;
const ColorPreview = Styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  border: 1px solid black;
  position: relative;
  &:hover {
    ${TickIcon} {
      visibility: visible;
    }
  }
`;
const QuantitySection = Styled.section`
  display:flex;
  align-items:center;
`;
const QtyButton = Styled.button`
  background:transparent;
  border:transparent;
  padding:2px;
  font-weight:bold;
  font-size:20px;
  &:focus{
    outline: none;
  }
`;
const QtyNumber = Styled.span`
  font-size:20px;
`;
const AddButtons = Styled.div`
  display:flex;
  align-items:center;
`;
const TabNav = Styled.nav`
  display:flex;
  justify-content: space-between;
  align-items: center;
`;
const TabList = Styled.li`
  display: inline-block;
  width:100%;
  text-align:center;
  font-weight:500;
  font-size:1.5rem;
  padding:5px;
  transition:0.3s;
  cursor:pointer;

  &:hover{
    background:#efefef;
    box-shadow: inset 0 -2px 0 var(--primary-color);
  }
`;

const ProductPage = () => {
  const { id } = useParams();
  const { error, loading } = useSelector((state) => state.Product);
  const Product = useSelector((state) => state.Product.product);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("description");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("");
  const readOnlyRating = {
    size: 28,
    isHalf: true,
    value: 3.8,
    edit: false,
  };

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const getImage = document.querySelector(
      `.product-images-section img[data-idx="${index}"]`
    );
    document.querySelectorAll(".product-images-section img").forEach((item) => {
      item.classList.remove("product-img-active");
    });
    if (getImage) getImage.classList.add("product-img-active");
  }, [index]);

  useEffect(() => {
    const getColor = document.querySelector(".color-circle");
    const getColorCircle = document.querySelector(".color-circle span");
    if (getColorCircle) getColorCircle.style.visibility = "visible";
    if (getColor) setColor(getColor.getAttribute("id").substring(3));

    const x = document.querySelector(".description");
    if (x) {
      x.innerHTML = Product.description;
      let images = document.querySelectorAll(".description img");
      if (images) {
        images.forEach((item) => {
          item.style.width = "100%";
        });
      }
    }
  }, [Product]);

  const setProductColor = (id) => {
    const getColor = document.querySelectorAll(".color-circle span");
    getColor.forEach((item) => {
      item.style.visibility = "visible";
    });
    const getCircle = document.querySelector(`${id} span`);
    if (getCircle) getCircle.style.visibility = "visible";
    setColor(id.substring(3));
  };

  const next = () => {
    if (index >= Product.images.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };
  const prev = () => {
    if (index <= 0) {
      setIndex(Product.images.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const showFullscreen = () => {
    setIsFullscreen(true);
    window.scrollTo(0, 0);
  };

  const increaseQty = () => {
    if (Product.stock > qty) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  useEffect(() => {
    const listenKeyboard = (e) => {
      if (e.code === "ArrowLeft") {
        prev();
      }
      if (e.code === "ArrowRight") {
        next();
      }
    };
    document.addEventListener("keydown", listenKeyboard);
    return function removeListener() {
      document.removeEventListener("keydown", listenKeyboard);
    };
  }, [next, prev]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFullscreen]);

  useEffect(() => {
    const getTab = document.querySelector(`.tab-nav-item[data-tab="${tab}"]`);
    const getTabs = document.querySelectorAll(".tab-nav-item");
    if (getTabs)
      getTabs.forEach((item) => item.classList.remove("tab-nav-item-active"));
    if (getTab) getTab.classList.add("tab-nav-item-active");
  }, [tab]);

  if (loading) {
    return (
      <img
        src={LoadingIcon}
        alt="Loading Icon"
        height="100px"
        style={{ display: "grid", margin: "auto" }}
      />
    );
  }
  if (error.msg === "Product Not Found" || error.msg === "Enter Valid Id.") {
    return <NotFound />;
  }
  if (Object.keys(Product).length > 0) {
    return (
      <div>
        {isFullscreen && (
          <FullscreenImage
            setIsFullscreen={setIsFullscreen}
            images={Product.images && Product.images}
            index={index}
            prev={prev}
            next={next}
            setIndex={setIndex}
          />
        )}

        <nav className="breadcrumb" style={{ fontSize: "14px" }}>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            <li style={{ display: "inline", textTransform: "capitalize" }}>
              <Link
                id="product-link"
                to={`/category/${
                  Product.category && Product.category.toLowerCase()
                }`}
              >
                {Product.category}
              </Link>
            </li>
            <NavDivider>></NavDivider>
            <li
              style={{
                display: "inline",
                paddingLeft: "10px",
                textTransform: "capitalize",
              }}
            >
              <Link
                id="product-link"
                to={`/category/${
                  Product.category &&
                  Product.subCategory &&
                  Product.category.toLowerCase()
                }/${Product.subCategory}`}
              >
                {Product.subCategory}
              </Link>
            </li>
            <NavDivider>></NavDivider>
            <li
              style={{
                display: "inline",
                paddingLeft: "10px",
                cursor: "pointer",
                color: "#0d6efd",
              }}
            >
              {Product.brand}
            </li>
          </ul>
        </nav>
        <div className="row" style={{ marginTop: "-20px" }}>
          <h2>{Product.title}</h2>
          <div className="col-md-6">
            {Product.images && (
              <ProductImages>
                <img
                  src={Product.images[index].url}
                  alt="product"
                  className="product-img"
                />
                <AiFillCaretRight
                  className="img-arrows right"
                  onClick={() => next()}
                />
                <AiFillCaretLeft
                  className="img-arrows left"
                  onClick={() => prev()}
                />
              </ProductImages>
            )}
            <ImageBottomSection>
              <span className="img-index" style={{ fontSize: "14px" }}>
                {`${index + 1}/${Product.images && Product.images.length}`}{" "}
                Photo
              </span>
              <button className="btn p-1" onClick={() => showFullscreen()}>
                Fullscreen
              </button>
            </ImageBottomSection>
            <section className="product-images-section">
              {Product.images &&
                Product.images.map((item, idx) => {
                  return (
                    <img
                      data-idx={idx}
                      key={idx}
                      src={item.url}
                      onClick={() => setIndex(idx)}
                      className={idx === 0 && "product-img-active"}
                      alt="product"
                    />
                  );
                })}
            </section>
          </div>
          <div className="col-md-6 mb-5">
            <section
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <section>
                <p className="lead" style={{ fontSize: "30px" }}>
                  <strong>{priceConverter(Product.price)}</strong>
                </p>
                <p
                  className={`${
                    Product.stock < 1 ? "text-danger" : "text-success"
                  }`}
                  style={{ marginTop: "-15px" }}
                >
                  <b>{`${Product.stock < 1 ? "Out Of Stock" : "In Stock"}`}</b>
                </p>
                <p
                  className="text-muted"
                  style={{ marginTop: "-15px", fontSize: "14px" }}
                >
                  {`${
                    Product.location.length >= 30
                      ? `${Product.location.substring(0, 30)}...`
                      : Product.location
                  }`}
                </p>
              </section>
              <section>
                <ReactStars {...readOnlyRating} />
                <span
                  className="text-muted"
                  style={{
                    textDecoration: "underline",
                    fontSize: "14px",
                    marginTop: "-15px",
                    cursor: "pointer",
                  }}
                >
                  <a href="#reviews">0 Ratings</a>
                </span>
              </section>
            </section>
            <hr />
            <div className="seller-section">
              <section
                style={{
                  background: "#efefef",
                  padding: "15px",
                  paddingBottom: "5px",
                }}
              >
                <section
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link to="/" id="product-link">
                    <h6 style={{ fontSize: "18px" }}>
                      {Product.shop.companyName}{" "}
                      <div className="badge bg-primary">9.4</div>
                    </h6>
                  </Link>
                  <Link to="/" id="product-link">
                    Go To Shop
                  </Link>
                </section>
                <p style={{ marginTop: "-8px" }}>{Product.shop.fullname}</p>
                <p style={{ marginTop: "-10px" }}>{Product.shop.phoneNumber}</p>
                <p style={{ marginTop: "-10px", marginBottom: "0px" }}>
                  <Link to="/" id="product-link">
                    Send Message About This Product
                  </Link>
                </p>
              </section>
            </div>
            <div className="product-info">
              <InfoRow>
                <span>
                  <b>Brand</b>
                </span>
                <span>{Product.brand}</span>
              </InfoRow>
              <InfoRow>
                <b>Color</b>
                {Product.colors.length > 0 &&
                  Product.colors.map((clr, idx) => {
                    return (
                      <ColorPreview
                        className="color-circle"
                        style={{ background: clr }}
                        onClick={() =>
                          setProductColor(`clr${clr.substring(1, clr.length)}`)
                        }
                        key={idx}
                        id={`clr${clr.substring(1, clr.length)}`}
                      >
                        <TickIcon>&#10003;</TickIcon>
                      </ColorPreview>
                    );
                  })}
              </InfoRow>
              <InfoRow>
                <b>Quantity</b>
                <QuantitySection>
                  <QtyButton onClick={() => increaseQty()}>
                    <AiOutlinePlus />
                  </QtyButton>
                  <QtyNumber>{qty}</QtyNumber>
                  <QtyButton onClick={() => decreaseQty()}>
                    <AiOutlineMinus />
                  </QtyButton>
                </QuantitySection>
              </InfoRow>
              <AddButtons>
                <button
                  className="default-btn w-100 pt-1 pb-1"
                  style={{ fontSize: "18px" }}
                  disabled={Product.stock < 1 ? true : false}
                >
                  Add To Cart
                </button>
                <button
                  className="default-btn pt-1 pb-1"
                  style={{ fontSize: "18px", borderLeft: "0" }}
                >
                  <FaHeart />
                </button>
              </AddButtons>
              <div className="w-100" style={{ position: "relative" }}>
                <p
                  style={{ position: "absolute", right: "0" }}
                  className="text-muted"
                >
                  In 0 People's Wishlist
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="product-details mt-5">
          <TabNav>
            <ul
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0",
                width: "100%",
              }}
            >
              <TabList
                data-tab="description"
                className="tab-nav-item tab-nav-item-active"
                onClick={() => setTab("description")}
              >
                Description
              </TabList>
              <TabList
                data-tab="location-tab"
                className="tab-nav-item"
                onClick={() => setTab("location-tab")}
              >
                Location
              </TabList>
            </ul>
          </TabNav>
          {Product && (
            <section style={{ background: "white" }}>
              {tab === "description" && (
                <ProductDescription Product={Product} />
              )}
              {tab === "location-tab" && (
                <ProductLocation coordinate={Product.coordinate} />
              )}
            </section>
          )}
        </div>
        <div className="review-section mt-5" id="reviews">
          <h1>Reviews</h1>
        </div>
      </div>
    );
  }
  return <></>;
};

export default ProductPage;