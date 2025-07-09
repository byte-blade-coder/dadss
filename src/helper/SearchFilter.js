import { Button, Input } from "antd";

function SearchFilter({ props }) {
    return (
        <div style={{ padding: 8, }}>
            <Input
                placeholder="Search"
                value={props.selectedKeys[0]}
                onChange={(e) => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => {
                    props.confirm();
                    props.close();
                }}
                style={{
                    marginBottom: 8,
                    display: 'block',
                }}
            />
            <div className="ant-table-filter-dropdown-btns">
                <Button
                    className="ant-btn ant-btn-link ant-btn-sm"
                    onClick={() => props.clearFilters && props.setSelectedKeys([])}
                >
                    Reset
                </Button>
                <Button
                    className="ant-btn ant-btn-primary ant-btn-sm"
                    onClick={() => {
                        props.confirm();
                        props.close();
                    }}
                >
                    OK
                </Button>
            </div>
        </div>
    );
}

export default SearchFilter;