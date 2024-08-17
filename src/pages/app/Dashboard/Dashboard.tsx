import { Helmet } from "react-helmet-async"
import {MonthRevenueCard} from "@/pages/app/Dashboard/month-revenue-card.tsx";
import {MonthOrdersAmountCard} from "@/pages/app/Dashboard/month-orders-amount-card.tsx";
import {DayOrdersAmountCard} from "@/pages/app/Dashboard/day-orders-amount-card.tsx";
import {MonthCanceledOrdersAmount} from "@/pages/app/Dashboard/month-canceled-orders-amount.tsx";
import {RevenueChart} from "@/pages/app/Dashboard/revenue-chart.tsx";
import {PopularProductsChart} from "@/pages/app/Dashboard/popular-products-chart.tsx";

export function Dashboard() {
    return (
        <>
        <Helmet title="dashboard" />
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

                <div className="grid grid-cols-4 gap-4">
                    <MonthRevenueCard />
                    <MonthOrdersAmountCard />
                    <DayOrdersAmountCard />
                    <MonthCanceledOrdersAmount />
                </div>

                <div className="grid grid-cols-9 gap-4">
                    <RevenueChart />
                    <PopularProductsChart />
                </div>
            </div>
        </>
    )
}