import face_recognition
import os
import argparse
from datetime import datetime

parser = argparse.ArgumentParser(description='Detect face in image')

parser.add_argument('-i', action='store', dest='image', help="Image to parse", type=str, default=None, required=True)
parser.add_argument('-v', action='store_true',dest='verbose',help="Show output log",default=False)
args = parser.parse_args()

image = face_recognition.load_image_file(args.image)
face_locations = face_recognition.face_locations(image)

if len(face_locations) is 0:
	exit(1)
else:
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    if args.verbose is True:
        print('[{}] - Face found in {}'.format(now, args.image))

    exit(0)