import os

command = """printenv"""
result = os.popen(command).read()
print(result)