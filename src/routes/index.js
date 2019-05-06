import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import {AdminPage, LoginMobilePage, LoginPcPage, LookOverPcPage, ShippingPcPage, ShippingMobilePage, ReceivingPage, DispatchPage, MainPage,SupplierSelectMobilePage} from "../modules";
import { AddOtherReceivingInfoDetail } from "../modules/receiving/components/AddOtherReceivingInfoDetail";
import NotFound from '../NotFound';
import {ReceivingConfirmList} from "../modules/receiving/components/ReceivingConfirmList";
import {AddOtherReceivingInfo} from "../modules/receiving/components/AddOtherReceivingInfo";
import {AddTransferInfo} from "../modules/transfer/components/AddTransferInfo";
import {AddTransferInfoDetail} from "../modules/transfer/components/AddTransferInfoDetail";
import {AddDeliverDispatchInfo} from "../modules/dispatch/components/AddDeliverDispatchInfo";
import {AddDeliverDispatchInfoDetail} from "../modules/dispatch/components/AddDeliverDispatchInfoDetail";

const isPcBrowser = () => {
    let userAgentInfo = navigator.userAgent;
    const agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    let flag = true;
    for (let v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

const getRouters = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route
                        path="/"
                        exact={true}
                        render={props => {
                            // console.log('isPcBrowser',isPcBrowser())
                            if (isPcBrowser()) {
                                return (
                                    <LoginPcPage
                                        router={props}
                                    />
                                )
                            } else {
                                return (
                                    <LoginMobilePage
                                        router={props}
                                    />
                                )
                            }
                        }}
                    />
                    <Route
                        path="/main"
                        exact
                        render={props => {
                            return (
                                <MainPage
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/receiving-confirm"
                        exact={true}
                        render={props => {
                            return (
                                <ReceivingConfirmList
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-receiving"
                        exact={true}
                        render={props => {
                            return (
                                <AddOtherReceivingInfo
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-receiving/detail"
                        exact={true}
                        render={props => {
                            return (
                                <AddOtherReceivingInfoDetail
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-transfer"
                        exact={true}
                        render={props => {
                            return (
                                <AddTransferInfo
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-transfer/detail"
                        exact={true}
                        render={props => {
                            return (
                                <AddTransferInfoDetail
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-dispatch"
                        exact={true}
                        render={props => {
                            return (
                                <AddDeliverDispatchInfo
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/main/add-dispatch/detail"
                        exact={true}
                        render={props => {
                            return (
                                <AddDeliverDispatchInfoDetail
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/admin"
                        render={props => {
                            return (
                                <AdminPage
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/look-over"
                        render={props => {
                            return (
                                <LookOverPcPage
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/shipping"
                        render={props => {
                            if (isPcBrowser()) {
                                return (
                                    <ShippingPcPage
                                        router={props}
                                    />
                                )
                            } else {
                                return (
                                    <ShippingMobilePage
                                        router={props}
                                    />
                                )
                            }
                        }}
                    />
                    <Route
                        path="/supplierselect"
                        render={props => {
                            return (
                                <SupplierSelectMobilePage
                                    router={props}
                                />
                            )
                        }}
                    />
                    <Route component={() => <NotFound />}/>
                </Switch>
            </div>
        </Router>
    )
}

export default getRouters