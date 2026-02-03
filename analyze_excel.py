import pandas as pd

file_path = '/home/z/my-project/upload/MERU TERRITORRYDECEMBER  BAS PAYMENT PAYROLL.xlsx'

# Read all sheets
all_sheets = pd.read_excel(file_path, sheet_name=None)

print("Sheet names:", list(all_sheets.keys()))
print("\n" + "="*80)

for sheet_name, df in all_sheets.items():
    print(f"\nSheet: {sheet_name}")
    print(f"Shape: {df.shape} (rows, columns)")
    print(f"Columns: {list(df.columns)}")
    print("\nFirst 10 rows:")
    print(df.head(10).to_string())
    print("\n" + "="*80)
