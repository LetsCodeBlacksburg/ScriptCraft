#!/bin/bash
cd "$( dirname "$0" )"
java -Xmx1024M -jar canarymod.jar -o true
