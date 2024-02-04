import "./style.css";

// Libraries
import { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { TableFooter, TableSortLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "react-bootstrap/Pagination";
import Axios from "axios";
import moment from "moment";
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Components
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import EnhancedBreadCrumb from "../../components/enhanced-breadcrumb";

// Assets
import sortingIcon from "../../assets/sorting-icon.svg";

function Dashboard() {
    // State
    const [orderReport, setOrderReport] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: null,
    });

    // Table Properties State
    const [order, setOrder] = useState({
        column: null,
        direction: "asc",
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Global Data
    let selectedMonth = moment().month();
    const token = localStorage.getItem("token");
    const headers = {
        Access_token: token,
    };

    // Lifecycle
    useEffect(() => {
        getDailyOrderReport();
        getOrderList();
    }, []);

    useEffect(() => {
        renderChart();
        renderTable();
    }, [orderReport, orderList]);

    useEffect(() => {
        getOrderList(`${order.column}:${order.direction}`, page, rowsPerPage);
    }, [order, page, rowsPerPage]);

    // API Call
    function getDailyOrderReport(
        from = moment().startOf("month").format("YYYY-MM-DD"),
        until = moment().endOf("month").format("YYYY-MM-DD")
    ) {
        renderLoading(document.querySelector(".chart-container"));
        Axios.get(
            `https://api-car-rental.binaracademy.org/admin/order/reports?from=${from}&until=${until}`,
            { headers: headers }
        )
            .then((response) => {
                const report = response.data.map((data) => {
                    return {
                        day: moment(data.day).date(),
                        orderCount: data.orderCount,
                    };
                });

                setOrderReport(report);
                removeLoading(document.querySelector(".chart-container"));
            })
            .catch((error) => {
                console.log(error);
                removeLoading(document.querySelector(".chart-container"));
            });
    }

    function getOrderList(
        sort = "created_at:desc",
        page = "1",
        pageSize = "10"
    ) {
        renderLoading(document.querySelector(".table-container"));
        Axios.get(
            `https://api-car-rental.binaracademy.org/admin/v2/order?sort${sort}&page=${page}&pageSize=${pageSize}`,
            { headers: headers }
        )
            .then((response) => {
                setOrderList(response.data.orders);

                setPagination({
                    page: response.data.page,
                    pageSize: response.data.pageSize,
                    pageCount: response.data.pageCount,
                });

                removeLoading(document.querySelector(".table-container"));
            })
            .catch((error) => {
                console.log(error);
                removeLoading(document.querySelector(".table-container"));
            });
    }

    // Utility Function
    function renderLoading(container) {
        let layout = document.createElement("div");
        layout.classList.add("layout");
        layout.style.width = "100%";
        layout.style.height = "100%";
        layout.style.position = "absolute";
        layout.style.top = "0";
        layout.style.left = "0";
        layout.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

        let spinner = document.createElement("div");
        spinner.classList.add("spinner-border", "text-primary");
        spinner.style.width = "3rem";
        spinner.style.height = "3rem";
        spinner.style.margin = "auto";
        spinner.style.position = "absolute";
        spinner.style.top = "50%";
        spinner.style.left = "50%";

        container.appendChild(layout);
        container.appendChild(spinner);
    }

    function removeLoading(container) {
        container.removeChild(container.querySelector(".layout"));
        container.removeChild(container.querySelector(".spinner-border"));
    }

    const renderChart = () => {
        const customTooltip = ({ active, payload, label }) => {
            return (
                <div className="custom-tooltip">
                    <p className="label bg-light p-1">{`Car Rented : ${
                        payload[0]?.value || 0
                    }`}</p>
                </div>
            );
        };

        return (
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    width={500}
                    height={300}
                    data={orderReport}
                    margin={{
                        top: 50,
                        bottom: 50,
                    }}
                >
                    <CartesianGrid />
                    <XAxis dataKey="day" />
                    <YAxis
                        label={{
                            value: "Amount of Car Rented",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip content={customTooltip} />
                    <Bar
                        dataKey="orderCount"
                        fill="#586B90"
                        activeBar={<Rectangle fill="gold" stroke="black" />}
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const renderTable = () => {
        let columns = [
            { field: "no", headerName: "No" },
            { field: "userEmail", headerName: "User Email" },
            { field: "car", headerName: "Car" },
            { field: "startRent", headerName: "Start Rent" },
            { field: "endRent", headerName: "End Rent", type: "number" },
            { field: "price", headerName: "Price" },
            { field: "category", headerName: "Category" },
        ];

        let rows = orderList.map((data, index) => {
            return {
                id: index,
                userEmail: data.User.email,
                car: "Car",
                startRent: moment(data.start_rent_at).format("DD MMM YYYY"),
                endRent: moment(data.end_rent_at).format("DD MMM YYYY"),
                price: data.total_price,
                category: "SUV",
            };
        });

        // Sort Rows based on order state
        let sortedRows;
        if (!order.column) sortedRows = rows;
        else if (order.direction === "asc") {
            let value = rows[0][order.column];

            // Date Type Sorting
            if (moment(value).isValid()) {
                sortedRows = rows.sort((a, b) => {
                    if (moment(a[order.column]).isBefore(b[order.column]))
                        return -1;
                    if (moment(a[order.column]).isAfter(b[order.column]))
                        return 1;
                    return 0;
                });
            } else {
                sortedRows = rows.sort((a, b) => {
                    if (a[order.column] < b[order.column]) return -1;
                    if (a[order.column] > b[order.column]) return 1;
                    return 0;
                });
            }
        } else if (order.direction === "desc") {
            let value = rows[0][order.column];

            // Date Type Sorting
            if (moment(value).isValid()) {
                sortedRows = rows.sort((a, b) => {
                    if (moment(a[order.column]).isBefore(b[order.column]))
                        return 1;
                    if (moment(a[order.column]).isAfter(b[order.column]))
                        return -1;
                    return 0;
                });
            } else {
                sortedRows = rows.sort((a, b) => {
                    if (a[order.column] > b[order.column]) return -1;
                    if (a[order.column] < b[order.column]) return 1;
                    return 0;
                });
            }
        }

        const handleSort = (column) => {
            const isAsc = order.column === column && order.direction === "asc";
            setOrder({
                column: column,
                direction: isAsc ? "desc" : "asc",
            });
        };

        const renderTableHead = () => {
            return columns.map((column, index) => {
                return (
                    <TableCell key={index} className="fw-bold">
                        {column.headerName}

                        <TableSortLabel
                            className="float-end"
                            direction={order.direction}
                            onClick={() => handleSort(column.field)}
                            IconComponent={() => (
                                <img
                                    src={sortingIcon}
                                    // Hide sorting icon on 'No' Column
                                    className={
                                        column.headerName == "No"
                                            ? "d-none"
                                            : ""
                                    }
                                />
                            )}
                        ></TableSortLabel>
                    </TableCell>
                );
            });
        };

        const renderTableBody = () => {
            return sortedRows.map((row, index) => {
                return (
                    <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.userEmail}</TableCell>
                        <TableCell>{row.car}</TableCell>
                        <TableCell>{row.startRent}</TableCell>
                        <TableCell>{row.endRent}</TableCell>
                        <TableCell>
                            {Intl.NumberFormat("es-ED").format(row.price)}
                        </TableCell>
                        <TableCell>{row.category}</TableCell>
                    </TableRow>
                );
            });
        };

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead
                        style={{
                            backgroundColor: "#CFD4ED",
                        }}
                    >
                        <TableRow>{renderTableHead()}</TableRow>
                    </TableHead>
                    <TableBody>{renderTableBody()}</TableBody>
                    <TableFooter className="d-none">
                        <TableRow>
                            <TablePagination
                                page={page}
                                count={pagination.pageCount}
                                rowsPerPage={pagination.pageSize}
                                onPageChange={(e, newPage) => {
                                    setPage(newPage);
                                }}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    };

    const renderPagination = () => {
        let currentPage = parseInt(page);
        let items = [];

        const generatePaginationItem = (i) => {
            return (
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => {
                        setPage(i);
                    }}
                >
                    {i}
                </Pagination.Item>
            );
        };

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => {
                    setPage(currentPage - 1);
                }}
                disabled={currentPage === 1}
            />
        );

        if (pagination.pageCount - currentPage < 5) {
            for (let i = currentPage; i <= pagination.pageCount; i++) {
                items.push(generatePaginationItem(i));
            }
        } else {
            for (let i = currentPage; i <= currentPage + 3; i++) {
                items.push(generatePaginationItem(i));
            }

            items.push(
                <Pagination.Ellipsis
                    key="ellipsis"
                    onClick={() => {
                        setPage(currentPage + 4);
                    }}
                />
            );
            items.push(generatePaginationItem(pagination.pageCount));
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => {
                    setPage(currentPage + 1);
                }}
                disabled={currentPage === pagination.pageCount}
            />
        );

        return items;
    };

    const populateMonthDropdown = () => {
        let months = moment.months();
        let currentYear = moment().year();
        return months.map((month, index) => {
            return (
                <option
                    key={index}
                    value={index}
                >{`${month} - ${currentYear}`}</option>
            );
        });
    };

    const populatePageDropdown = () => {
        let pages = [];
        for (let i = 1; i <= pagination.pageCount; i++) {
            pages.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return pages;
    };

    // Event Handler
    const handleMonthChange = () => {
        getDailyOrderReport(
            moment().month(selectedMonth).startOf("month").format("YYYY-MM-DD"),
            moment().month(selectedMonth).endOf("month").format("YYYY-MM-DD")
        );
    };

    return (
        <>
            <div id="dashboard">
                <div className="row m-0 p-0">
                    <Sidebar />
                    <div className="col m-0 p-0">
                        <Navigation />
                        <EnhancedBreadCrumb />
                        <div
                            id="dashboard-content"
                            className="container-fluid ps-4 pt-4 overflow-auto"
                            style={{
                                height: "calc(100vh - 136px)",
                            }}
                        >
                            <section id="render-car-data-section" className="">
                                <h5 className="section-title px-3 py-2 mb-3">
                                    Render Car Data Visualization
                                </h5>
                                <span className="d-inline-block mb-2">
                                    Month
                                </span>
                                <div
                                    className="input-group"
                                    style={{ maxWidth: "230px" }}
                                >
                                    <select
                                        className="form-select"
                                        id="monthSelection"
                                        onChange={(e) => {
                                            selectedMonth = e.target.value;
                                        }}
                                        defaultValue={moment().month()}
                                    >
                                        {populateMonthDropdown()}
                                    </select>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={handleMonthChange}
                                    >
                                        Go
                                    </button>
                                </div>
                                <div className="chart-container position-relative">
                                    {renderChart()}
                                </div>
                            </section>
                            <section id="order-list-section" className="py-3">
                                <h3 className="mb-4">Dashboard</h3>
                                <h5 className="section-title px-3 py-2 mb-3">
                                    List Order
                                </h5>
                                <div className="table-container">
                                    {renderTable()}
                                </div>
                                <div className="custom-pagination py-3">
                                    <div className="row">
                                        <div className="col-auto">
                                            <label
                                                htmlFor="limit"
                                                className="form-label"
                                            >
                                                Limit
                                            </label>
                                            <select
                                                className="form-select"
                                                id="limit"
                                                onChange={(e) => {
                                                    setRowsPerPage(
                                                        e.target.value
                                                    );
                                                }}
                                                defaultValue={10}
                                            >
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>
                                        <div className="col-auto">
                                            <label
                                                htmlFor="pageSelection"
                                                className="form-label"
                                            >
                                                Jump to page
                                            </label>
                                            <div
                                                style={{ minWidth: "120px" }}
                                                className="input-group"
                                            >
                                                <select
                                                    className="form-select"
                                                    id="pageSelection"
                                                    defaultValue={1}
                                                >
                                                    {populatePageDropdown()}
                                                </select>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        let page =
                                                            document.querySelector(
                                                                "#pageSelection"
                                                            ).value;
                                                        setPage(page);
                                                    }}
                                                >
                                                    Go
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-auto ms-auto d-flex align-items-end">
                                            <Pagination>
                                                {renderPagination()}
                                            </Pagination>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
