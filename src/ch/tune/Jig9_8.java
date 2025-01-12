package ch.tune;

public class Jig9_8 extends Jig {

	@Override
	public int getNumberOfForms() {
		return 3;
	}

	@Override
	public String getMeasure() {
		return "9/8";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}
	
	@Override
	public String getName(){
		return "9_8-"+super.getName();
	}
}