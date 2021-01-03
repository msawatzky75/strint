Note: This library is incomplete and development has stopped after i found bigint :P

# StrInt
A string encoded Integer class that can handle numbers bigger than 53 bits. This was meant as brain food, and not to be used in any production code.

#### Constructor
| Parameters | Types |
| --- | --- |
| num | StrInt, String, Number |

> Caution: String value must match `/^\d+$/`

#### Methods
| Method | Parameters | Description |
| --- | --- | --- |
| StrInt.abs | `value: StrInt` | Returns positive instance of provided value. |
| add | `value: StrInt,String,Number` | Adds provided value to instance. |
| subtract | `value: StrInt,String,Number` | Subtracts provided value from instance. |
| multiply | `value: StrInt,String,Number` | Multiplies instance by provided value. |


