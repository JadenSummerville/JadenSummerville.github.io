import random
def circlePoint(n):
    total = 2;
    while(total>1):
        total = 0;
        array = [random.uniform(-1,1) for i in range(n)];
        for coordinate in array:
            total+=coordinate*coordinate;
    return array
print(circlePoint(2));