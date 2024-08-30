"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import Home from "./componenet/Home";

 function Page() {


  return (
  
    <main>
    <Home />
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-primary">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">gold Card</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-secondary">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">paltinum Card</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-success">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">silver card </h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-danger">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Danger card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-warning">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Warning card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-info">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Info card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-light">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Light card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 d-flex">
          <div className="card text-bg-dark">
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Dark card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>



  );
}
export default Page;

