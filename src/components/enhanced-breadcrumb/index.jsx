import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const EnhancedBreadCrumb = () => {
    function formatPathName(pathName) {
        const toCapatalize = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        // Path Name contains '-' character
        if (pathName.includes("-")) {
            return pathName
                .split("-")
                .map((path) => toCapatalize(path))
                .join(" ");
        } else {
            return toCapatalize(pathName);
        }
    }
    const populateBreadcrumb = () => {
        // Get path names from URL
        const pathNames = window.location.pathname.split("/");
        pathNames.shift(); //Remove empty path name

        // Generate Label and URL for each path name
        let pathNameDetails = pathNames.map((pathName, index) => {
            return {
                label: formatPathName(pathName),
                url: "/" + pathNames.slice(0, index + 1).join("/"),
            };
        });

        // Generate Link Component for each path name
        return pathNameDetails.map((pathNameDetail, index) => {
            return (
                <Link
                    key={index}
                    underline="hover"
                    color={
                        index === pathNameDetails.length - 1
                            ? "textPrimary"
                            : "inherit"
                    }
                    href={index == 0 ? "" : pathNameDetail.url}
                    className="text-decoration-none"
                >
                    {pathNameDetail.label}
                </Link>
            );
        });
    };

    return (
        <Breadcrumbs
            className="ms-4 my-4"
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
        >
            {populateBreadcrumb()}
        </Breadcrumbs>
    );
};

export default EnhancedBreadCrumb;
