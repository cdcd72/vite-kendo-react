import { useState } from 'react';

import {
  Grid,
  GridCellProps,
  GridColumn,
  GridDataStateChangeEvent,
  GridRowClickEvent,
} from '@progress/kendo-react-grid';
import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
  process,
} from '@progress/kendo-data-query';
import { Window } from '@progress/kendo-react-dialogs';

import './App.scss';

import productsData from './data/products.json';
import categoriesData from './data/categories.json';

const CheckboxColumn = (props: GridCellProps) => {
  return (
    <td>
      <input
        type="checkbox"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        checked={props.dataItem[props.field ?? '']}
        disabled={true}
      />
    </td>
  );
};

interface IProduct {
  ProductID: number;
  ProductName: string;
  CategoryID: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  Discontinued: boolean;
}

interface ICategory {
  CategoryID: number;
  CategoryName: string;
}

interface IDateState {
  filter?: CompositeFilterDescriptor;
  sort: SortDescriptor[];
  skip: number;
  take: number;
}

function App() {
  const products: IProduct[] = productsData as IProduct[];
  const categories: ICategory[] = categoriesData as ICategory[];
  const [category, setCategory] = useState<number | null>(null);
  const [dataState, setDateState] = useState<IDateState>({
    filter: undefined,
    sort: [{ field: 'ProductName', dir: 'asc' }],
    skip: 0,
    take: 10,
  });
  const [windowVisible, setWindowVisible] = useState<boolean>(false);
  const [gridClickedRow, setGridClickedRow] = useState<IProduct>({
    ProductID: 0,
    ProductName: '',
    CategoryID: 0,
    QuantityPerUnit: '',
    UnitPrice: 0,
    UnitsInStock: 0,
    Discontinued: false,
  });

  const handleDropDownListChange = (event: DropDownListChangeEvent) => {
    const category = event.target.value as ICategory;
    const newDataState = { ...dataState };
    if (category.CategoryID !== null) {
      newDataState.filter = {
        logic: 'and',
        filters: [
          {
            field: 'CategoryID',
            operator: 'eq',
            value: category.CategoryID,
          },
        ],
      };
      newDataState.skip = 0;
    } else {
      newDataState.filter = undefined;
      newDataState.skip = 0;
    }

    setCategory(category.CategoryID);
    setDateState(newDataState);
  };

  const handleGridDataStateChange = (event: GridDataStateChangeEvent) => {
    const dataState: IDateState = {
      filter: event.dataState.filter ?? undefined,
      sort: event.dataState.sort ?? [],
      skip: event.dataState.skip ?? 0,
      take: event.dataState.take ?? 10,
    };
    setDateState(dataState);
  };

  const handleGridRowClick = (event: GridRowClickEvent) => {
    setWindowVisible(true);
    setGridClickedRow(event.dataItem as IProduct);
  };

  const closeWindow = () => {
    setWindowVisible(false);
  };

  return (
    <div className="App">
      <p>
        <DropDownList
          data={categories}
          dataItemKey="CategoryID"
          textField="CategoryName"
          defaultItem={{ CategoryID: null, CategoryName: 'Product categories' }}
          onChange={handleDropDownListChange}
        />
        &nbsp; Selected category ID: <strong>{category}</strong>
      </p>
      <Grid
        data={process(products, dataState)}
        style={{ height: '400px' }}
        pageable={true}
        sortable={true}
        {...dataState}
        onDataStateChange={handleGridDataStateChange}
        onRowClick={handleGridRowClick}
      >
        <GridColumn field="ProductName" title="Product Name" />
        <GridColumn field="UnitPrice" title="Price" format="{0:c}" />
        <GridColumn field="UnitsInStock" title="Units in Stock" />
        <GridColumn field="Discontinued" cell={CheckboxColumn} />
      </Grid>
      {windowVisible && (
        <Window title="Product Details" onClose={closeWindow} height={250}>
          <dl style={{ textAlign: 'left' }}>
            <dt>Product Name</dt>
            <dd>{gridClickedRow.ProductName}</dd>
            <dt>Product ID</dt>
            <dd>{gridClickedRow.ProductID}</dd>
            <dt>Quantity per Unit</dt>
            <dd>{gridClickedRow.QuantityPerUnit}</dd>
          </dl>
        </Window>
      )}
    </div>
  );
}

export default App;
