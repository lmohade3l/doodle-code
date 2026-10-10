# گزارش

## فرضیه‌های اولیه (قبل از دیدن کد)
| تیکت | فرضیه‌ی یک‌خطی |
|---|---|
| 201 | we are sending the wrong amount to backend? |
| 202 | the cencel functionality should not exist in this status + if it did refetch the data |
| 203 | refetch the detail data on entering the page + maybe it has stale time |
| 204 | ? i should check the code for this |
| 205 | the validation checks for number whereas the weight is an string |
| 206 | ? i should check the code for this |
| 207 | the amount calculation should depend on all- weight and city |
| 208 | the paste functionality does not work + maybe the type is wrong(string/number) |
| 209 | refetchInterval? |
| 210 | the filter does not work correctly |
| 211 | refetch the data on cancel or submit |
| 212 | width is fixed |
| 213 |  |
| 214 |  |
| 215 |  |

## ترتیب و دلیلش
urgent: 201 , 205 , 202 , 206 , 203
medium: 207 , 211 , 204 , 209 
low: 208 , 210 , 213 , 214 , 215 , 212

## تیکت‌های حل‌شده
| تیکت | علت (یک جمله) | فایل | چطور تست کردم |
|---|---|---|---|
| 201 | the lable was wrongly 'toman' | format.ts | |
| 202 | removed the cancel button for DELIVERED status + for statuses that is DOES make sense we should not use optimistic result display and just invalidate the query |
| 203 | removed the stale time + use isFetching along with isLoading cause when there's a cache this one gets triggered also used refetchInterval instead of setInterval for freshing the data | ShipmentDetailPage + useShipment | 
| 204 | the getNextPageParam in useShipment was wrong, changed it to lastPage.page + 1 |
| 205 | the type in the form was string | NewShipmentPage | {...register('weightKg', { valueAsNumber: true })} - it did not give error on entering a weight
| 206 | the zod validation was checking with NaN when it was not entered, removed value as number and add a preprocess to zod, also added optional() |
| 207 | city was not in the dependencies, added it and it |
| 208 |  |
| 209 | it was because of the setInterval? |
| 210 | the value for the tab to go in status was wrong changed to DELIVERED |
| 211 | stats fetch had infinity stale time, i made it 10 mins and invalidated the query on mutations |
| 212 | overflow-x: auto |
| 213 |  |
| 214 |  |
| 215 |  |

## نیمه‌کاره (تا کجا رسیدم، قدم بعدی)

## نرسیدم (حدس علت)

## چیزهایی که دیدم ولی تو تیکت‌ها نبود

## چیزهایی که باید به تیم‌های دیگه گفته بشه

## از AI کجا استفاده کردم، و کجا جوابش رو قبول نکردم
